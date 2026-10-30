package cl.losmaestros.ventas.exception;

import org.springframework.http.HttpStatus;

public class NegocioException extends RuntimeException {
    public final HttpStatus estado;
    public NegocioException(HttpStatus estado, String mensaje) { super(mensaje); this.estado = estado; }
    public static NegocioException conflicto(String mensaje) { return new NegocioException(HttpStatus.CONFLICT, mensaje); }
    public static NegocioException noExiste(String mensaje) { return new NegocioException(HttpStatus.NOT_FOUND, mensaje); }
    public static NegocioException dependencia(String mensaje) { return new NegocioException(HttpStatus.SERVICE_UNAVAILABLE, mensaje); }
}
