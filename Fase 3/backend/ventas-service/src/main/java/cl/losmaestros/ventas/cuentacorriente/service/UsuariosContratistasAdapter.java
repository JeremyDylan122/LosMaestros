package cl.losmaestros.ventas.cuentacorriente.service;

import cl.losmaestros.ventas.exception.NegocioException;
import java.net.http.HttpClient;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.HttpClientErrorException;

@Service
@ConditionalOnProperty(name = "ventas.usuarios.url")
public class UsuariosContratistasAdapter implements UsuariosContratistas {
    private final RestClient cliente;
    private final String secreto;

    public UsuariosContratistasAdapter(@Value("${ventas.usuarios.url}") String url,
            @Value("${ventas.usuarios.internal-token:}") String secreto) {
        var http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
        var peticiones = new JdkClientHttpRequestFactory(http);
        peticiones.setReadTimeout(Duration.ofSeconds(5));
        this.cliente = RestClient.builder().baseUrl(url).requestFactory(peticiones).build();
        this.secreto = secreto;
    }

    @Override
    public boolean esContratistaActivo(long usuarioId) {
        if (secreto.isBlank()) {
            throw NegocioException.dependencia("Falta configurar la credencial interna de Usuarios.");
        }
        try {
            EstadoUsuario usuario = cliente.get().uri("/api/v1/interno/usuarios/{id}", usuarioId)
                    .header("X-Service-Token", secreto).retrieve().body(EstadoUsuario.class);
            if (usuario == null || usuario.id() == null || usuario.id() != usuarioId
                    || usuario.activo() == null || usuario.rol() == null) {
                throw NegocioException.dependencia("Respuesta inválida de Usuarios.");
            }
            return usuario.activo() && "CONTRATISTA".equals(usuario.rol());
        } catch (HttpClientErrorException.NotFound error) {
            return false;
        } catch (RestClientException error) {
            throw NegocioException.dependencia("No se pudo verificar el contratista en Usuarios.");
        }
    }

    public record EstadoUsuario(Long id, Boolean activo, String rol) {}
}
