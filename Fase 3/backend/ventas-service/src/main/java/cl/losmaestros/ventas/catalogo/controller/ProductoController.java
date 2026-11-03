package cl.losmaestros.ventas.catalogo.controller;

import cl.losmaestros.ventas.catalogo.dto.*;
import cl.losmaestros.ventas.catalogo.service.CatalogoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
@Tag(name = "Productos", description = "Catálogo ferretero, inventario y existencias en bodega")
public class ProductoController {

    private final CatalogoService catalogoService;

    public ProductoController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    @GetMapping
    @Operation(summary = "Consultar catálogo de productos con filtros y paginación")
    public ResponseEntity<Page<ProductoResponseDto>> listar(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Boolean enOferta,
            @RequestParam(required = false) String buscar,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort
    ) {
        int limitSize = Math.min(Math.max(1, size), 100);
        Sort sortOrder = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "asc"), sort[0]);
        var pageable = PageRequest.of(Math.max(0, page), limitSize, sortOrder);

        return ResponseEntity.ok(catalogoService.listarProductos(categoriaId, enOferta, buscar, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle completo de un producto por ID")
    public ResponseEntity<ProductoResponseDto> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(catalogoService.obtenerProductoPorId(id));
    }

    @GetMapping("/criticos")
    @Operation(summary = "Listar artículos con nivel de stock igual o inferior al umbral mínimo")
    public ResponseEntity<List<ProductoResponseDto>> obtenerCriticos() {
        return ResponseEntity.ok(catalogoService.obtenerStockCritico());
    }

    @GetMapping("/ofertas")
    @Operation(summary = "Listar artículos con promociones y descuentos activos")
    public ResponseEntity<List<ProductoResponseDto>> obtenerOfertas() {
        return ResponseEntity.ok(catalogoService.obtenerOfertas());
    }

    @PostMapping
    @Operation(summary = "Crear nuevo artículo en catálogo (Sólo Administrador)")
    public ResponseEntity<ProductoResponseDto> crear(@Valid @RequestBody ProductoCreacionDto dto) {
        var creado = catalogoService.crearProducto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar datos y ficha técnica de un producto (Sólo Administrador)")
    public ResponseEntity<ProductoResponseDto> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoActualizacionDto dto
    ) {
        return ResponseEntity.ok(catalogoService.actualizarProducto(id, dto));
    }

    @PatchMapping("/{id}/stock")
    @Operation(summary = "Ajuste rápido o reabastecimiento de existencias (Sólo Administrador)")
    public ResponseEntity<ProductoResponseDto> ajustarStock(
            @PathVariable Long id,
            @Valid @RequestBody AjusteStockDto dto
    ) {
        return ResponseEntity.ok(catalogoService.ajustarStock(id, dto.delta()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Dar de baja lógica un producto del catálogo (Sólo Administrador)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        catalogoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}
