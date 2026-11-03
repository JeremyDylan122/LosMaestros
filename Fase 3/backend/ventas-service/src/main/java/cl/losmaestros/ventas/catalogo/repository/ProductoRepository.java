package cl.losmaestros.ventas.catalogo.repository;

import cl.losmaestros.ventas.catalogo.entity.Producto;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {

    Optional<Producto> findByCodigoIgnoreCase(String codigo);

    boolean existsByCodigoIgnoreCase(String codigo);

    /**
     * Bloqueo pesimista exclusivo para transacciones de compra/ajuste de stock concurrentes.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Producto p WHERE p.id = :id")
    Optional<Producto> findByIdForUpdate(@Param("id") Long id);

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stock <= p.stockMinimo ORDER BY p.stock ASC")
    List<Producto> findStockCritico();

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.enOferta = true ORDER BY p.descuento DESC")
    List<Producto> findOfertas();

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "(:categoriaId IS NULL OR p.categoria.id = :categoriaId) AND " +
           "(:enOferta IS NULL OR p.enOferta = :enOferta) AND " +
           "(:search IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(p.codigo) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(p.marca) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Producto> buscarProductos(
            @Param("categoriaId") Long categoriaId,
            @Param("enOferta") Boolean enOferta,
            @Param("search") String search,
            Pageable pageable
    );
}
