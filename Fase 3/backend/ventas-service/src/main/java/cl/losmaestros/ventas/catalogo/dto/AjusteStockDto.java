package cl.losmaestros.ventas.catalogo.dto;

import jakarta.validation.constraints.NotNull;

public record AjusteStockDto(
    @NotNull(message = "El delta de stock es obligatorio")
    Integer delta
) {}
