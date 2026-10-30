package cl.losmaestros.ventas.pedidos.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="pedidos", indexes=@Index(name="idx_pedido_usuario", columnList="usuarioId"))
public class Pedido {
    public enum Estado { CONFIRMADO, EN_PREPARACION, DESPACHADO, ENTREGADO, ANULADO }
    public enum Entrega { RETIRO_TIENDA, DESPACHO_OBRA }
    public enum Pago { CUENTA_CORRIENTE, WEBPAY_SIMULADO, TRANSFERENCIA }
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @Version public long version;
    @Column(nullable=false) public long usuarioId;
    @Column(nullable=false) public Instant fecha = Instant.now();
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Estado estado = Estado.CONFIRMADO;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Entrega deliveryType;
    @Enumerated(EnumType.STRING) @Column(nullable=false) public Pago paymentMethod;
    public String customerName, customerEmail, region, commune, phone, empresa;
    @Column(length=300) public String address;
    @Column(length=500) public String notes;
    @Column(nullable=false, precision=19, scale=2) public BigDecimal subtotal;
    @Column(nullable=false, precision=19, scale=2) public BigDecimal shippingFee;
    @Column(nullable=false, precision=19, scale=2) public BigDecimal totalMonto;
    @ElementCollection
    @CollectionTable(name="detalle_pedido", joinColumns=@JoinColumn(name="pedido_id"))
    @OrderColumn(name="posicion")
    public List<DetallePedido> items = new ArrayList<>();
}
