package cl.losmaestros.usuarios.usuario.controller;

import cl.losmaestros.usuarios.usuario.dto.*;
import cl.losmaestros.usuarios.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {
    private final UsuarioService usuarios;

    public UsuarioController(UsuarioService usuarios) {
        this.usuarios = usuarios;
    }

    @GetMapping("/me")
    public UsuarioResponse perfil(@AuthenticationPrincipal Jwt jwt) {
        return usuarios.perfil(Long.parseLong(jwt.getSubject()));
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return usuarios.listar();
    }

    @GetMapping("/{id}")
    public UsuarioResponse detalle(@PathVariable long id) {
        return usuarios.detalle(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse crear(@Valid @RequestBody UsuarioRequest datos) {
        return usuarios.crear(datos);
    }

    @PutMapping("/{id}")
    public UsuarioResponse actualizar(@PathVariable long id, @Valid @RequestBody UsuarioRequest datos) {
        return usuarios.actualizar(id, datos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivar(@PathVariable long id) {
        usuarios.desactivar(id);
    }
}
