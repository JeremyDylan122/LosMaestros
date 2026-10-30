package cl.losmaestros.ventas.pedidos.service;

import cl.losmaestros.ventas.pedidos.dto.*;
import cl.losmaestros.ventas.pedidos.entity.*;
import cl.losmaestros.ventas.pedidos.entity.Pedido.*;
import cl.losmaestros.ventas.pedidos.repository.PedidoRepository;
import cl.losmaestros.ventas.cuentacorriente.service.CuentaService;
import cl.losmaestros.ventas.exception.NegocioException;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.TreeMap;

@Service
public class PedidoService {
    private final PedidoRepository pedidos;
    private final CuentaService cuentas;
    private final ObjectProvider<CatalogoPedidos> proveedor;
    public PedidoService(PedidoRepository pedidos, CuentaService cuentas, ObjectProvider<CatalogoPedidos> proveedor) {
        this.pedidos=pedidos; this.cuentas=cuentas; this.proveedor=proveedor;
    }
    @Transactional
    public PedidoResponse comprar(Actor actor, CompraRequest r) {
        var catalogo=catalogo();
        var cantidades=new TreeMap<Long,Integer>(); // Orden de bloqueo estable para evitar interbloqueos.
        for (var linea:r.items()) {
            long suma=(long)cantidades.getOrDefault(linea.id(),0)+linea.cantidad();
            if (suma>1000000) throw NegocioException.conflicto("Cantidad acumulada demasiado grande.");
            cantidades.put(linea.id(),(int)suma);
        }
        var p=new Pedido(); p.usuarioId=actor.usuarioId();
        for (var entrada:cantidades.entrySet()) {
            var producto=catalogo.bloquear(entrada.getKey());
            if (producto==null) throw NegocioException.noExiste("Producto no encontrado.");
            if (!producto.activo()) throw NegocioException.conflicto("Producto no disponible para compra.");
            if (producto.precioUnitario()==null || producto.precioUnitario().signum()<0)
                throw NegocioException.conflicto("Precio de catálogo inválido.");
            if (producto.stock()<entrada.getValue()) throw NegocioException.conflicto("Stock insuficiente para "+producto.nombre());
            p.items.add(new DetallePedido(producto.id(),producto.codigo(),producto.nombre(),producto.precioUnitario(),entrada.getValue()));
        }
        p.subtotal=p.items.stream().map(i -> i.subtotal).reduce(BigDecimal.ZERO,BigDecimal::add);
        p.shippingFee=despacho(r,p.subtotal); p.totalMonto=p.subtotal.add(p.shippingFee);
        p.deliveryType=r.deliveryType(); p.paymentMethod=r.paymentMethod();
        p.customerName=r.customerName(); p.customerEmail=r.customerEmail(); p.region=r.region(); p.commune=r.commune();
        p.address=r.address(); p.phone=r.phone(); p.empresa=r.empresa(); p.notes=r.notes();
        // Estas escrituras se revierten si el crédito u otra operación posterior falla.
        for (var linea:p.items) catalogo.ajustarStock(linea.productoId,-linea.cantidad);
        if (p.paymentMethod==Pago.CUENTA_CORRIENTE) {
            if (!actor.contratista()) throw new AccessDeniedException("Solo contratistas pueden comprar a crédito.");
            cuentas.cargar(actor.usuarioId(),p.totalMonto);
        }
        return PedidoResponse.de(pedidos.saveAndFlush(p));
    }
    @Transactional(readOnly=true)
    public Page<PedidoResponse> listar(Actor actor, int pagina, int tamano) {
        var page=PageRequest.of(Math.max(0,pagina),Math.max(1,Math.min(tamano,100)),Sort.by(Sort.Direction.DESC,"id"));
        return (actor.personal() ? pedidos.findAll(page) : pedidos.findByUsuarioId(actor.usuarioId(),page)).map(PedidoResponse::de);
    }
    @Transactional(readOnly=true)
    public PedidoResponse consultar(Actor actor,long id) {
        var p=pedidos.findById(id).orElseThrow(() -> NegocioException.noExiste("Pedido no encontrado."));
        if (!actor.personal() && actor.usuarioId()!=p.usuarioId) throw NegocioException.noExiste("Pedido no encontrado.");
        return PedidoResponse.de(p);
    }
    @Transactional
    public PedidoResponse cambiarEstado(Actor actor,long id,Estado nuevo) {
        if (!actor.administrador()) throw new AccessDeniedException("Solo el administrador modifica pedidos.");
        var p=pedidos.bloquear(id).orElseThrow(() -> NegocioException.noExiste("Pedido no encontrado."));
        if (p.estado==nuevo) return PedidoResponse.de(p);
        if (p.estado==Estado.ANULADO || p.estado==Estado.ENTREGADO) throw NegocioException.conflicto("El pedido ya está cerrado.");
        if (nuevo!=Estado.ANULADO && nuevo.ordinal()<=p.estado.ordinal()) throw NegocioException.conflicto("El estado no puede retroceder.");
        if (nuevo==Estado.ANULADO) {
            var catalogo=catalogo();
            for (var linea:p.items.stream().sorted(java.util.Comparator.comparingLong(i -> i.productoId)).toList()) {
                catalogo.bloquear(linea.productoId);
                catalogo.ajustarStock(linea.productoId,linea.cantidad);
            }
            if (p.paymentMethod==Pago.CUENTA_CORRIENTE) cuentas.restituir(p.usuarioId,p.totalMonto);
        }
        p.estado=nuevo;
        return PedidoResponse.de(p);
    }
    private CatalogoPedidos catalogo() {
        var c=proveedor.getIfAvailable();
        if (c==null) throw NegocioException.dependencia("Falta conectar el catálogo de Jeremy.");
        return c;
    }
    private BigDecimal despacho(CompraRequest r,BigDecimal subtotal) {
        if (r.deliveryType()==Entrega.RETIRO_TIENDA) return BigDecimal.ZERO;
        if (r.address()==null || r.address().isBlank()) throw NegocioException.conflicto("Indica la dirección de despacho.");
        if ("Región de Coquimbo".equals(r.region())) {
            if ("La Serena".equals(r.commune()) || "Coquimbo".equals(r.commune()))
                return subtotal.compareTo(new BigDecimal("100000"))>=0 ? BigDecimal.ZERO : new BigDecimal("4990");
            if ("Vicuña".equals(r.commune())) return new BigDecimal("14990");
        }
        throw NegocioException.conflicto("La ubicación requiere cotización; selecciona retiro en tienda.");
    }
}
