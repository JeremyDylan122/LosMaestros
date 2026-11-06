package cl.losmaestros.usuarios.config;

import cl.losmaestros.usuarios.usuario.dto.UsuarioRequest;
import cl.losmaestros.usuarios.usuario.entity.Rol;
import cl.losmaestros.usuarios.usuario.repository.UsuarioRepository;
import cl.losmaestros.usuarios.usuario.service.UsuarioService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminInicial {
    @Bean
    ApplicationRunner crearAdminInicial(UsuarioRepository repositorio, UsuarioService usuarios,
            @Value("${USUARIOS_ADMIN_PASSWORD:}") String password) {
        return args -> {
            if (!password.isBlank() && !repositorio.existsByRol(Rol.ADMIN)) {
                if (password.length() < 4 || password.length() > 10) {
                    throw new IllegalStateException("USUARIOS_ADMIN_PASSWORD debe tener entre 4 y 10 caracteres.");
                }
                usuarios.crear(new UsuarioRequest("11222333-9", "Carlos", "Vega Osorio",
                        "admin@duoc.cl", password, Rol.ADMIN, null, null, null, null));
            }
        };
    }
}
