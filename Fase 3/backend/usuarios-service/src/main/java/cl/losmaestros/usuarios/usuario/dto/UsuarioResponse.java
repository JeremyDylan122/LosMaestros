package cl.losmaestros.usuarios.usuario.dto;

import cl.losmaestros.usuarios.usuario.entity.Rol;
import cl.losmaestros.usuarios.usuario.entity.Usuario;

public record UsuarioResponse(Long id, String run, String nombre, String apellidos, String email,
        Rol rol, boolean activo, String region, String comuna, String direccion, String empresa) {
    public static UsuarioResponse de(Usuario usuario) {
        return new UsuarioResponse(usuario.id, usuario.run, usuario.nombre, usuario.apellidos, usuario.email,
                usuario.rol, usuario.activo, usuario.region, usuario.comuna, usuario.direccion, usuario.empresa);
    }
}
