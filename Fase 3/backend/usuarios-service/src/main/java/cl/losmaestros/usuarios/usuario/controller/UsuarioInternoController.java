package cl.losmaestros.usuarios.usuario.controller;

import cl.losmaestros.usuarios.usuario.dto.UsuarioResponse;
import cl.losmaestros.usuarios.usuario.entity.Rol;
import cl.losmaestros.usuarios.usuario.service.UsuarioService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/interno/usuarios")
@SecurityRequirement(name = "serviceToken")
public class UsuarioInternoController {
    private final UsuarioService usuarios;

    public UsuarioInternoController(UsuarioService usuarios) {
        this.usuarios = usuarios;
    }

    @GetMapping("/{id}")
    public EstadoUsuario consultar(@PathVariable long id) {
        UsuarioResponse usuario = usuarios.detalle(id);
        return new EstadoUsuario(usuario.id(), usuario.activo(), usuario.rol());
    }

    public record EstadoUsuario(Long id, boolean activo, Rol rol) {}
}
