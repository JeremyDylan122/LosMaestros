package cl.losmaestros.usuarios;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"USUARIOS_ADMIN_PASSWORD=prueba123", "USUARIOS_INTERNAL_TOKEN=prueba-interna"})
@AutoConfigureMockMvc
class UsuariosMartinTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    @Test
    void swaggerDistingueJwtYCredencialInterna() throws Exception {
        mvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.components.securitySchemes.bearerAuth.scheme").value("bearer"))
                .andExpect(jsonPath("$.components.securitySchemes.serviceToken.name").value("X-Service-Token"))
                .andExpect(jsonPath("$.paths['/api/v1/usuarios/me'].get.security[0].bearerAuth").isArray())
                .andExpect(jsonPath("$.paths['/api/v1/interno/usuarios/{id}'].get.security[0].serviceToken").isArray())
                .andExpect(jsonPath("$.paths['/api/v1/auth/login'].post.security").doesNotExist());
    }

    private static final String REGISTRO = """
            {"run":"12.345.678-5","nombre":"Ana","apellidos":"Rojas",
             "email":"ANA@gmail.com","password":"clave123","rol":"CLIENTE"}
            """;

    @Test
    void consultaInternaExigeCredencialDeServicio() throws Exception {
        String admin = login("admin@duoc.cl", "prueba123");
        mvc.perform(get("/api/v1/interno/usuarios/1"))
                .andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/interno/usuarios/1").header("Authorization", "Bearer " + admin))
                .andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/interno/usuarios/1").header("X-Service-Token", "incorrecto"))
                .andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/interno/usuarios/1").header("X-Service-Token", "prueba-interna"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rol").value("ADMIN"))
                .andExpect(jsonPath("$.email").doesNotExist())
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
        mvc.perform(get("/api/v1/interno/usuarios/99999").header("X-Service-Token", "prueba-interna"))
                .andExpect(status().isNotFound());
    }

    @Test
    void registroPerfilYDuplicado() throws Exception {
        String respuesta = mvc.perform(post("/api/v1/auth/registro").contentType("application/json").content(REGISTRO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuario.run").value("12345678-5"))
                .andExpect(jsonPath("$.usuario.passwordHash").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        String token = json.readTree(respuesta).path("token").asText();
        mvc.perform(get("/api/v1/usuarios/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("ana@gmail.com"));
        mvc.perform(get("/api/v1/usuarios").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/v1/auth/registro").contentType("application/json").content(REGISTRO))
                .andExpect(status().isConflict());
    }

    @Test
    void registroPublicoRechazaRolesDeGestion() throws Exception {
        mvc.perform(post("/api/v1/auth/registro").contentType("application/json")
                        .content(REGISTRO.replace("CLIENTE", "ADMIN")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void adminGestionaUsuariosYDesactivacionBloqueaLogin() throws Exception {
        String admin = login("admin@duoc.cl", "prueba123");
        String vendedor = """
                {"run":"11111111-1","nombre":"Luis","apellidos":"Rojas",
                 "email":"luis@duoc.cl","password":"clave123","rol":"VENDEDOR"}
                """;
        String respuesta = mvc.perform(post("/api/v1/usuarios").header("Authorization", "Bearer " + admin)
                        .contentType("application/json").content(vendedor))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        long id = json.readTree(respuesta).path("id").asLong();
        String tokenVendedor = login("luis@duoc.cl", "clave123");
        mvc.perform(get("/api/v1/usuarios").header("Authorization", "Bearer " + tokenVendedor))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/api/v1/usuarios/{id}", id).header("Authorization", "Bearer " + admin))
                .andExpect(status().isNoContent());
        mvc.perform(post("/api/v1/auth/login").contentType("application/json")
                        .content(credenciales("luis@duoc.cl", "clave123")))
                .andExpect(status().isUnauthorized());
    }

    private String login(String email, String password) throws Exception {
        String respuesta = mvc.perform(post("/api/v1/auth/login").contentType("application/json")
                        .content(credenciales(email, password)))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        return json.readTree(respuesta).path("token").asText();
    }

    private String credenciales(String email, String password) {
        return """
                {"email":"%s","password":"%s"}
                """.formatted(email, password);
    }
}
