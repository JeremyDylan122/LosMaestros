package cl.losmaestros.ventas.catalogo.service;

import cl.losmaestros.ventas.catalogo.dto.*;
import cl.losmaestros.ventas.catalogo.entity.Categoria;
import cl.losmaestros.ventas.catalogo.entity.Producto;
import cl.losmaestros.ventas.catalogo.repository.CategoriaRepository;
import cl.losmaestros.ventas.catalogo.repository.ProductoRepository;
import cl.losmaestros.ventas.exception.NegocioException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CatalogoService {

    private final ProductoRepository productoRepo;
    private final CategoriaRepository categoriaRepo;

    public CatalogoService(ProductoRepository productoRepo, CategoriaRepository categoriaRepo) {
        this.productoRepo = productoRepo;
        this.categoriaRepo = categoriaRepo;
    }

    // --- CATEGORÍAS ---

    @Transactional(readOnly = true)
    public List<CategoriaResponseDto> listarCategorias() {
        return categoriaRepo.findAll().stream()
                .map(c -> new CategoriaResponseDto(
                        c.getId(),
                        c.getNombre(),
                        c.getDescripcion(),
                        c.isActivo(),
                        c.getProductos() != null ? (int) c.getProductos().stream().filter(Producto::isActivo).count() : 0
                ))
                .toList();
    }

    public CategoriaResponseDto crearCategoria(CategoriaCreacionDto dto) {
        if (categoriaRepo.existsByNombreIgnoreCase(dto.nombre().trim())) {
            throw NegocioException.conflicto("La categoría '" + dto.nombre() + "' ya existe.");
        }
        var cat = new Categoria(dto.nombre().trim(), dto.descripcion());
        cat = categoriaRepo.save(cat);
        return new CategoriaResponseDto(cat.getId(), cat.getNombre(), cat.getDescripcion(), cat.isActivo(), 0);
    }

    // --- PRODUCTOS ---

    @Transactional(readOnly = true)
    public Page<ProductoResponseDto> listarProductos(Long categoriaId, Boolean enOferta, String search, Pageable pageable) {
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        return productoRepo.buscarProductos(categoriaId, enOferta, cleanSearch, pageable)
                .map(this::mapearADto);
    }

    @Transactional(readOnly = true)
    public ProductoResponseDto obtenerProductoPorId(Long id) {
        var p = productoRepo.findById(id)
                .orElseThrow(() -> NegocioException.noExiste("Producto no encontrado con ID: " + id));
        return mapearADto(p);
    }

    @Transactional(readOnly = true)
    public List<ProductoResponseDto> obtenerStockCritico() {
        return productoRepo.findStockCritico().stream()
                .map(this::mapearADto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoResponseDto> obtenerOfertas() {
        return productoRepo.findOfertas().stream()
                .map(this::mapearADto)
                .toList();
    }

    public ProductoResponseDto crearProducto(ProductoCreacionDto dto) {
        if (productoRepo.existsByCodigoIgnoreCase(dto.codigo().trim())) {
            throw NegocioException.conflicto("El código SKU '" + dto.codigo() + "' ya se encuentra registrado.");
        }
        var categoria = categoriaRepo.findById(dto.categoriaId())
                .orElseThrow(() -> NegocioException.noExiste("Categoría no encontrada con ID: " + dto.categoriaId()));

        var p = new Producto(
                dto.codigo().trim().toUpperCase(),
                dto.nombre().trim(),
                categoria,
                dto.subcategoria(),
                dto.marca(),
                dto.unidad(),
                dto.precio(),
                dto.precioCompra(),
                dto.stock(),
                dto.stockMinimo(),
                dto.enOferta(),
                dto.descuento(),
                dto.descripcion(),
                dto.imagen(),
                dto.especificaciones()
        );
        p = productoRepo.save(p);
        return mapearADto(p);
    }

    public ProductoResponseDto actualizarProducto(Long id, ProductoActualizacionDto dto) {
        var p = productoRepo.findById(id)
                .orElseThrow(() -> NegocioException.noExiste("Producto no encontrado con ID: " + id));

        var categoria = categoriaRepo.findById(dto.categoriaId())
                .orElseThrow(() -> NegocioException.noExiste("Categoría no encontrada con ID: " + dto.categoriaId()));

        p.setNombre(dto.nombre().trim());
        p.setCategoria(categoria);
        p.setSubcategoria(dto.subcategoria());
        p.setMarca(dto.marca());
        p.setUnidad(dto.unidad());
        p.setPrecio(dto.precio());
        p.setPrecioCompra(dto.precioCompra());
        p.setStock(dto.stock());
        p.setStockMinimo(dto.stockMinimo());
        p.setEnOferta(dto.enOferta());
        p.setDescuento(dto.descuento());
        p.setDescripcion(dto.descripcion());
        p.setImagen(dto.imagen());
        p.setEspecificaciones(dto.especificaciones());
        p.setActivo(dto.activo());

        p = productoRepo.save(p);
        return mapearADto(p);
    }

    public ProductoResponseDto ajustarStock(Long id, int delta) {
        var p = productoRepo.findByIdForUpdate(id)
                .orElseThrow(() -> NegocioException.noExiste("Producto no encontrado con ID: " + id));

        int nuevoStock = p.getStock() + delta;
        if (nuevoStock < 0) {
            throw NegocioException.conflicto("El stock no puede quedar negativo. Stock actual: " + p.getStock());
        }
        p.setStock(nuevoStock);
        p = productoRepo.save(p);
        return mapearADto(p);
    }

    public void eliminarProducto(Long id) {
        var p = productoRepo.findById(id)
                .orElseThrow(() -> NegocioException.noExiste("Producto no encontrado con ID: " + id));
        // Baja lógica para conservar la integridad referencial de los pedidos históricos
        p.setActivo(false);
        productoRepo.save(p);
    }

    private ProductoResponseDto mapearADto(Producto p) {
        return new ProductoResponseDto(
                p.getId(),
                p.getCodigo(),
                p.getNombre(),
                p.getCategoria() != null ? p.getCategoria().getId() : null,
                p.getCategoria() != null ? p.getCategoria().getNombre() : "General",
                p.getSubcategoria(),
                p.getMarca(),
                p.getUnidad(),
                p.getPrecio(),
                p.getPrecioCompra(),
                p.getPrecioEfectivo(),
                p.getStock(),
                p.getStockMinimo(),
                p.isStockCritico(),
                p.isEnOferta(),
                p.getDescuento(),
                p.getDescripcion(),
                p.getImagen(),
                p.getEspecificaciones(),
                p.isActivo()
        );
    }
}
