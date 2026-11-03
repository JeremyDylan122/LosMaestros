package cl.losmaestros.ventas.catalogo.dto;

public record CategoriaResponseDto(
    Long id,
    String nombre,
    String descripcion,
    boolean activo,
    int totalProductos
) {}
