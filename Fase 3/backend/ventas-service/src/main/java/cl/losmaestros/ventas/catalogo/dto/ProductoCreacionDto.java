package cl.losmaestros.ventas.catalogo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductoCreacionDto(
    @NotBlank(message = "El código SKU es obligatorio")
    @Size(max = 50, message = "El código no puede superar los 50 caracteres")
    String codigo,

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(max = 200, message = "El nombre no puede superar los 200 caracteres")
    String nombre,

    @NotNull(message = "La categoría es obligatoria")
    Long categoriaId,

    String subcategoria,
    String marca,
    String unidad,

    @NotNull(message = "El precio es obligatorio")
    @Min(value = 0, message = "El precio no puede ser negativo")
    BigDecimal precio,

    BigDecimal precioCompra,

    @Min(value = 0, message = "El stock inicial no puede ser negativo")
    int stock,

    @Min(value = 0, message = "El stock mínimo no puede ser negativo")
    int stockMinimo,

    boolean enOferta,

    @Min(value = 0, message = "El descuento no puede ser negativo")
    int descuento,

    String descripcion,
    String imagen,
    String especificaciones
) {}
