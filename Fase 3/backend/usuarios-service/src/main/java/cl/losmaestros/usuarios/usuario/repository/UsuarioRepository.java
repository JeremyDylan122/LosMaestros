package cl.losmaestros.usuarios.usuario.repository;

import cl.losmaestros.usuarios.usuario.entity.Rol;
import cl.losmaestros.usuarios.usuario.entity.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByRol(Rol rol);
    Optional<Usuario> findByEmailAndActivoTrue(String email);
}
