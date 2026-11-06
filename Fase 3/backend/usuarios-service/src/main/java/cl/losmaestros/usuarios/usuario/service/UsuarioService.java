package cl.losmaestros.usuarios.usuario.service;

import cl.losmaestros.usuarios.usuario.dto.*;
import cl.losmaestros.usuarios.usuario.entity.*;
import cl.losmaestros.usuarios.usuario.repository.UsuarioRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class UsuarioService {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwords;

    public UsuarioService(UsuarioRepository usuarios, PasswordEncoder passwords) {
        this.usuarios = usuarios;
        this.passwords = passwords;
    }

    public List<UsuarioResponse> listar() {
        return usuarios.findAll().stream().map(UsuarioResponse::de).toList();
    }

    public UsuarioResponse detalle(long id) {
        return UsuarioResponse.de(buscar(id));
    }

    public UsuarioResponse perfil(long id) {
        Usuario usuario = buscar(id);
        if (!usuario.activo) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La cuenta está desactivada.");
        }
        return UsuarioResponse.de(usuario);
    }

    public UsuarioResponse autenticar(String email, String password) {
        return usuarios.findByEmailAndActivoTrue(email.strip().toLowerCase(Locale.ROOT))
                .filter(usuario -> passwords.matches(password, usuario.passwordHash))
                .map(UsuarioResponse::de)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas."));
    }

    @Transactional
    public UsuarioResponse registrar(UsuarioRequest datos) {
        if (datos.rol() == Rol.ADMIN || datos.rol() == Rol.VENDEDOR) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol inválido para el registro público.");
        }
        return crear(datos);
    }

    @Transactional
    public UsuarioResponse crear(UsuarioRequest datos) {
        if (datos.password() == null || datos.password().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria.");
        }
        return guardar(new Usuario(), datos);
    }

    @Transactional
    public UsuarioResponse actualizar(long id, UsuarioRequest datos) {
        return guardar(buscar(id), datos);
    }

    @Transactional
    public void desactivar(long id) {
        buscar(id).activo = false;
    }

    private Usuario buscar(long id) {
        return usuarios.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    private UsuarioResponse guardar(Usuario usuario, UsuarioRequest datos) {
        usuario.run = normalizarRun(datos.run());
        usuario.email = datos.email().strip().toLowerCase(Locale.ROOT);
        if (!usuario.email.matches("[^\\s@]+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El dominio o formato del correo no es válido.");
        }
        usuario.nombre = datos.nombre().strip();
        usuario.apellidos = datos.apellidos().strip();
        usuario.region = datos.region();
        usuario.comuna = datos.comuna();
        usuario.direccion = datos.direccion();
        usuario.empresa = datos.empresa();
        if (datos.rol() != null) {
            usuario.rol = datos.rol();
        } else if (usuario.rol == null) {
            usuario.rol = Rol.CLIENTE;
        }
        if (datos.password() != null) {
            if (datos.password().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña no puede estar en blanco.");
            }
            usuario.passwordHash = passwords.encode(datos.password());
        }
        return UsuarioResponse.de(usuarios.saveAndFlush(usuario));
    }

    private String normalizarRun(String run) {
        String compacto = run.strip().replaceAll("[.\\s-]", "").toUpperCase(Locale.ROOT);
        if (!compacto.matches("[0-9]{6,8}[0-9K]")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de RUN inválido.");
        }
        String cuerpo = compacto.substring(0, compacto.length() - 1);
        int suma = 0;
        int factor = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += (cuerpo.charAt(i) - '0') * factor;
            factor = factor == 7 ? 2 : factor + 1;
        }
        int resto = 11 - suma % 11;
        char esperado = resto == 11 ? '0' : resto == 10 ? 'K' : (char) ('0' + resto);
        if (compacto.charAt(cuerpo.length()) != esperado || Long.parseLong(cuerpo) == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El RUN no es válido.");
        }
        return Long.parseLong(cuerpo) + "-" + esperado;
    }
}
