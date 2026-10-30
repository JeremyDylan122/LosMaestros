package cl.losmaestros.ventas.pedidos.service;

import java.math.BigDecimal;

/** Contrato de Jeremy: usar la misma base y transacción JPA de Ventas. */
public interface CatalogoPedidos {
    /** Bloquea el producto hasta finalizar la transacción; devuelve precio efectivo, no precio de lista. */
    Producto bloquear(long productoId);
    /** Modifica el stock bloqueado; delta negativo descuenta y positivo restituye. Nunca REQUIRES_NEW. */
    void ajustarStock(long productoId, int delta);
    record Producto(long id, String codigo, String nombre, BigDecimal precioUnitario, int stock, boolean activo) {}
}
