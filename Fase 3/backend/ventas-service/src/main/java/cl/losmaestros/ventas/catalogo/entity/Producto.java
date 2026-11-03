package cl.losmaestros.ventas.catalogo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "productos", indexes = {
    @Index(name = "idx_producto_codigo", columnList = "codigo", unique = true),
    @Index(name = "idx_producto_categoria", columnList = "categoria_id")
})
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String nombre;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(length = 100)
    private String subcategoria;

    @Column(length = 100)
    private String marca;

    @Column(length = 50)
    private String unidad;

    @NotNull
    @Min(0)
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal precio;

    @Column(name = "precio_compra", precision = 19, scale = 2)
    private BigDecimal precioCompra;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private int stock;

    @Column(name = "stock_minimo", nullable = false)
    private int stockMinimo;

    @Column(name = "en_oferta", nullable = false)
    private boolean enOferta = false;

    @Column(nullable = false)
    private int descuento = 0;

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 500)
    private String imagen;

    @Column(length = 1000)
    private String especificaciones;

    @Column(nullable = false)
    private boolean activo = true;

    public Producto() {}

    public Producto(String codigo, String nombre, Categoria categoria, String subcategoria,
                    String marca, String unidad, BigDecimal precio, BigDecimal precioCompra,
                    int stock, int stockMinimo, boolean enOferta, int descuento,
                    String descripcion, String imagen, String especificaciones) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.categoria = categoria;
        this.subcategoria = subcategoria;
        this.marca = marca;
        this.unidad = unidad != null ? unidad : "Unidad";
        this.precio = precio;
        this.precioCompra = precioCompra != null ? precioCompra : BigDecimal.ZERO;
        this.stock = stock;
        this.stockMinimo = stockMinimo;
        this.enOferta = enOferta;
        this.descuento = descuento;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.especificaciones = especificaciones;
        this.activo = true;
    }

    /**
     * Calcula el precio efectivo considerando ofertas y descuentos porcentuales.
     */
    public BigDecimal getPrecioEfectivo() {
        if (enOferta && descuento > 0 && precio != null) {
            BigDecimal factor = BigDecimal.valueOf(100 - descuento)
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            return precio.multiply(factor).setScale(2, RoundingMode.HALF_UP);
        }
        return precio != null ? precio.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
    }

    public boolean isStockCritico() {
        return stock <= stockMinimo;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public String getSubcategoria() { return subcategoria; }
    public void setSubcategoria(String subcategoria) { this.subcategoria = subcategoria; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public BigDecimal getPrecioCompra() { return precioCompra; }
    public void setPrecioCompra(BigDecimal precioCompra) { this.precioCompra = precioCompra; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public int getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(int stockMinimo) { this.stockMinimo = stockMinimo; }

    public boolean isEnOferta() { return enOferta; }
    public void setEnOferta(boolean enOferta) { this.enOferta = enOferta; }

    public int getDescuento() { return descuento; }
    public void setDescuento(int descuento) { this.descuento = descuento; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public String getEspecificaciones() { return especificaciones; }
    public void setEspecificaciones(String especificaciones) { this.especificaciones = especificaciones; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
}
