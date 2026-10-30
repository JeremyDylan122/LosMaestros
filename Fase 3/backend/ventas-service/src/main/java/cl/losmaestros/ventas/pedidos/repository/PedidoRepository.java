package cl.losmaestros.ventas.pedidos.repository;

import cl.losmaestros.ventas.pedidos.entity.Pedido;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface PedidoRepository extends JpaRepository<Pedido,Long> {
    Page<Pedido> findByUsuarioId(long usuarioId, Pageable page);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Pedido p where p.id = :id")
    Optional<Pedido> bloquear(@Param("id") long id);
}
