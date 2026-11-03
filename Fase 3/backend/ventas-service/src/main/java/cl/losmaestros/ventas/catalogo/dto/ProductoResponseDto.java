package cl.losmaestros.ventas.catalogo.dto;

import java.math.BigDecimal;

public record ProductoResponseDto(
    Long id,
    String codigo,
    String nombre,
    Long categoriaId,
    String categoriaNombre,
    String subcategoria,
    String marca,
    String unidad,
    BigDecimal precio,
    BigDecimal precioCompra,
    BigDecimal precioEfectivo,
    int stock,
    int stockMinimo,
    boolean stockCritico,
    boolean enOferta,
    int descuento,
    String descripcion,
    String imagen,
    String especificaciones,
    boolean activo
) {}
