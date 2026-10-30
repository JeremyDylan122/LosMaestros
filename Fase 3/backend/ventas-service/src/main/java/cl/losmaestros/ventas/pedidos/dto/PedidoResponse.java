package cl.losmaestros.ventas.pedidos.dto;

import cl.losmaestros.ventas.pedidos.entity.Pedido;
import cl.losmaestros.ventas.pedidos.entity.Pedido.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

public record PedidoResponse(Long id, String codigoOrden, long userId, Instant fecha, Estado estado,
        String estadoPago, Entrega deliveryType, Pago paymentMethod, String customerName,
        String customerEmail, String region, String commune, String address, String phone,
        String empresa, String notes, BigDecimal subtotal, BigDecimal shippingFee,
        BigDecimal totalMonto, List<Linea> items) {
    public record Linea(long id, String codigo, String nombre, BigDecimal precioUnitario, int cantidad, BigDecimal subtotal) {}
    public static PedidoResponse de(Pedido p) {
        String pago = p.estado == Estado.ANULADO ? "ANULADO" : switch(p.paymentMethod) {
            case CUENTA_CORRIENTE -> "PENDIENTE_FIN_DE_MES";
            case TRANSFERENCIA -> "PENDIENTE_TRANSFERENCIA";
            case WEBPAY_SIMULADO -> "PAGADO_SIMULADO";
        };
        return new PedidoResponse(p.id, "LM-"+p.fecha.atZone(ZoneOffset.UTC).getYear()+"-"+String.format("%04d",p.id),
            p.usuarioId,p.fecha,p.estado,pago,p.deliveryType,p.paymentMethod,p.customerName,p.customerEmail,
            p.region,p.commune,p.address,p.phone,p.empresa,p.notes,p.subtotal,p.shippingFee,p.totalMonto,
            p.items.stream().map(i -> new Linea(i.productoId,i.codigo,i.nombre,i.precioUnitario,i.cantidad,i.subtotal)).toList());
    }
}
