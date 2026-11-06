package cl.losmaestros.ventas;

import cl.losmaestros.ventas.cuentacorriente.repository.CuentaRepository;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UsuariosContratistasTests {
    private static final HttpServer servidor;
    private static volatile int codigo;
    private static volatile String respuesta;

    static {
        try {
            servidor = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            servidor.createContext("/api/v1/interno/usuarios/123", intercambio -> {
                if (!"prueba-interna".equals(intercambio.getRequestHeaders().getFirst("X-Service-Token"))) {
                    intercambio.sendResponseHeaders(401, -1);
                } else {
                    byte[] cuerpo = respuesta.getBytes(StandardCharsets.UTF_8);
                    intercambio.getResponseHeaders().set("Content-Type", "application/json");
                    intercambio.sendResponseHeaders(codigo, cuerpo.length);
                    intercambio.getResponseBody().write(cuerpo);
                }
                intercambio.close();
            });
            servidor.start();
        } catch (java.io.IOException error) {
            throw new ExceptionInInitializerError(error);
        }
    }

    @DynamicPropertySource
    static void configurar(DynamicPropertyRegistry propiedades) {
        propiedades.add("ventas.usuarios.url", () -> "http://127.0.0.1:" + servidor.getAddress().getPort());
        propiedades.add("ventas.usuarios.internal-token", () -> "prueba-interna");
    }

    @Autowired MockMvc mvc;
    @Autowired CuentaRepository cuentas;

    @BeforeEach
    void preparar() {
        cuentas.deleteAll();
        codigo = 200;
        respuesta = "{\"id\":123,\"activo\":true,\"rol\":\"CONTRATISTA\"}";
    }

    @AfterAll
    static void detener() {
        servidor.stop(0);
    }

    private void configurarCuenta(int esperado) throws Exception {
        mvc.perform(put("/api/v1/cuentas-corrientes/123")
                        .with(jwt().jwt(j -> j.subject("1"))
                                .authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                        .contentType("application/json")
                        .content("{\"activa\":true,\"creditoMaximo\":" + (esperado == 200 ? 100000 : 200000) + "}"))
                .andExpect(status().is(esperado));
    }

    @Test
    void habilitaContratistaVerificadoPorHttp() throws Exception {
        configurarCuenta(200);
        assertThat(cuentas.findById(123L)).isPresent();
    }

    @Test
    void rechazaInexistenteInactivoYOtroRol() throws Exception {
        codigo = 404;
        configurarCuenta(409);
        codigo = 200;
        respuesta = "{\"id\":123,\"activo\":false,\"rol\":\"CONTRATISTA\"}";
        configurarCuenta(409);
        respuesta = "{\"id\":123,\"activo\":true,\"rol\":\"CLIENTE\"}";
        configurarCuenta(409);
        assertThat(cuentas.findById(123L)).isEmpty();
    }

    @Test
    void fallaDeUsuariosConservaCuentaPrevia() throws Exception {
        configurarCuenta(200);
        codigo = 503;
        configurarCuenta(503);
        assertThat(cuentas.findById(123L).orElseThrow().creditoMaximo).isEqualByComparingTo("100000");
        codigo = 401;
        configurarCuenta(503);
        codigo = 200;
        respuesta = "{\"id\":999,\"activo\":true,\"rol\":\"CONTRATISTA\"}";
        configurarCuenta(503);
        respuesta = "{}";
        configurarCuenta(503);
        assertThat(cuentas.findById(123L).orElseThrow().creditoMaximo).isEqualByComparingTo("100000");
    }
}
