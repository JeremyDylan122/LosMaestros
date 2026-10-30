package cl.losmaestros.ventas;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("local")
class VentasServiceApplicationTests {
    @Test
    void contextLoads() {
        // Comprueba el cableado de la plantilla, no funcionalidades de negocio.
    }
}
