package cl.losmaestros.ventas.pedidos.dto;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import cl.losmaestros.ventas.pedidos.entity.Pedido.*;

// No admite usuarioId, rol, precio ni totales: los determina el servidor.
public record CompraRequest(
    @NotEmpty @Size(max=100) List<@NotNull @Valid Linea> items,
    @NotNull Entrega deliveryType,
    @NotNull Pago paymentMethod,
    @NotBlank @Size(max=150) String customerName,
    @NotBlank @Email @Size(max=100) String customerEmail,
    @Size(max=100) String region,
    @Size(max=100) String commune,
    @Size(max=300) String address,
    @Size(max=30) String phone,
    @Size(max=150) String empresa,
    @Size(max=500) String notes
) {
    public record Linea(@Positive long id, @Min(1) @Max(1000000) int cantidad) {}
}
