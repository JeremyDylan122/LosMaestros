package cl.losmaestros.ventas.pedidos.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Embeddable
public class DetallePedido {
    public long productoId;
    public String codigo;
    public String nombre;
    @Column(nullable=false, precision=19, scale=2) public BigDecimal precioUnitario;
    public int cantidad;
    @Column(nullable=false, precision=19, scale=2) public BigDecimal subtotal;
    protected DetallePedido() {}
    public DetallePedido(long id, String codigo, String nombre, BigDecimal precio, int cantidad) {
        this.productoId=id; this.codigo=codigo; this.nombre=nombre;
        this.precioUnitario=precio; this.cantidad=cantidad;
        this.subtotal=precio.multiply(BigDecimal.valueOf(cantidad));
    }
}
