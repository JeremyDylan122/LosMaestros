package cl.losmaestros.usuarios;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("local")
class UsuariosServiceApplicationTests {
    @Test
    void contextLoads() {
        // Comprueba el cableado de la plantilla, no funcionalidades de negocio.
    }
}
