package cl.losmaestros.usuarios.usuario.dto;

import cl.losmaestros.usuarios.usuario.entity.Rol;
import jakarta.validation.constraints.*;

public record UsuarioRequest(
        @NotBlank @Size(max = 30) String run,
        @NotBlank @Size(max = 50) String nombre,
        @NotBlank @Size(max = 100) String apellidos,
        @NotBlank @Size(max = 100) String email,
        @Size(min = 4, max = 10) String password,
        Rol rol,
        @Size(max = 100) String region,
        @Size(max = 100) String comuna,
        @Size(max = 300) String direccion,
        @Size(max = 150) String empresa) {
}
