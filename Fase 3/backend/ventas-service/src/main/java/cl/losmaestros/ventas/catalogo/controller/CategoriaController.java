package cl.losmaestros.ventas.catalogo.controller;

import cl.losmaestros.ventas.catalogo.dto.CategoriaCreacionDto;
import cl.losmaestros.ventas.catalogo.dto.CategoriaResponseDto;
import cl.losmaestros.ventas.catalogo.service.CatalogoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
@Tag(name = "Categorías", description = "Endpoints de consulta y administración de familias ferreteras")
public class CategoriaController {

    private final CatalogoService catalogoService;

    public CategoriaController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    @GetMapping
    @Operation(summary = "Listar todas las categorías disponibles")
    public ResponseEntity<List<CategoriaResponseDto>> listar() {
        return ResponseEntity.ok(catalogoService.listarCategorias());
    }

    @PostMapping
    @Operation(summary = "Crear una nueva categoría (Sólo Administrador)")
    public ResponseEntity<CategoriaResponseDto> crear(@Valid @RequestBody CategoriaCreacionDto dto) {
        var creada = catalogoService.crearCategoria(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }
}
