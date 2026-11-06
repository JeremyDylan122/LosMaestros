package cl.losmaestros.usuarios.auth.controller;

import cl.losmaestros.usuarios.usuario.dto.*;
import cl.losmaestros.usuarios.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UsuarioService usuarios;
    private final JwtEncoder encoder;
    private final String emisor;

    public AuthController(UsuarioService usuarios, JwtEncoder encoder,
            @Value("${USUARIOS_JWT_ISSUER:losmaestros-usuarios}") String emisor) {
        this.usuarios = usuarios;
        this.encoder = encoder;
        this.emisor = emisor;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public Sesion registro(@Valid @RequestBody UsuarioRequest datos) {
        return sesion(usuarios.registrar(datos));
    }

    @PostMapping("/login")
    public Sesion login(@Valid @RequestBody Login datos) {
        return sesion(usuarios.autenticar(datos.email(), datos.password()));
    }

    private Sesion sesion(UsuarioResponse usuario) {
        Instant ahora = Instant.now();
        var claims = JwtClaimsSet.builder().issuer(emisor).subject(usuario.id().toString())
                .issuedAt(ahora).expiresAt(ahora.plus(30, ChronoUnit.MINUTES))
                .claim("roles", List.of(usuario.rol().name())).build();
        String token = encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        return new Sesion(token, usuario);
    }

    public record Login(@NotBlank @Size(max = 100) String email,
            @NotBlank @Size(min = 4, max = 10) String password) {}

    public record Sesion(String token, UsuarioResponse usuario) {}
}
