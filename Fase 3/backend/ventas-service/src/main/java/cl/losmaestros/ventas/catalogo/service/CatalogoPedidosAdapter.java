package cl.losmaestros.ventas.catalogo.service;

import cl.losmaestros.ventas.catalogo.entity.Producto;
import cl.losmaestros.ventas.catalogo.repository.ProductoRepository;
import cl.losmaestros.ventas.exception.NegocioException;
import cl.losmaestros.ventas.pedidos.service.CatalogoPedidos;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Adaptador oficial de Jeremy para el contrato con Pedidos de Seba.
 * Ejecuta sobre la misma conexión de base de datos y participa en la transacción activa de Ventas.
 */
@Service
@Transactional
public class CatalogoPedidosAdapter implements CatalogoPedidos {

    private final ProductoRepository productoRepo;

    public CatalogoPedidosAdapter(ProductoRepository productoRepo) {
        this.productoRepo = productoRepo;
    }

    @Override
    public Producto bloquear(long productoId) {
        var entidad = productoRepo.findByIdForUpdate(productoId)
                .orElseThrow(() -> NegocioException.noExiste("Producto no encontrado en catálogo con ID: " + productoId));

        return new Producto(
                entidad.getId(),
                entidad.getCodigo(),
                entidad.getNombre(),
                entidad.getPrecioEfectivo(),
                entidad.getStock(),
                entidad.isActivo()
        );
    }

    @Override
    public void ajustarStock(long productoId, int delta) {
        var entidad = productoRepo.findByIdForUpdate(productoId)
                .orElseThrow(() -> NegocioException.noExiste("Producto no encontrado en catálogo con ID: " + productoId));

        int nuevoStock = entidad.getStock() + delta;
        if (nuevoStock < 0) {
            throw NegocioException.conflicto("Stock insuficiente para el producto: " + entidad.getNombre() +
                    " (Disponible: " + entidad.getStock() + ", Solicitado descuente: " + (-delta) + ")");
        }

        entidad.setStock(nuevoStock);
        productoRepo.save(entidad);
    }
}
