package cl.losmaestros.ventas.cuentacorriente.repository;

import cl.losmaestros.ventas.cuentacorriente.entity.CuentaCorriente;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface CuentaRepository extends JpaRepository<CuentaCorriente,Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from CuentaCorriente c where c.usuarioId = :id")
    Optional<CuentaCorriente> bloquear(@Param("id") long id);
}
