package cl.losmaestros.usuarios.exception;

import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ErroresUsuarios {
    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<Map<String, String>> negocio(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode()).body(Map.of("mensaje", error.getReason()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<Map<String, String>> duplicado() {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("mensaje", "El correo o RUN ya está registrado."));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, String>> validacion(MethodArgumentNotValidException error) {
        var campo = error.getBindingResult().getFieldError();
        String mensaje = campo == null ? "Datos inválidos." : campo.getField() + ": " + campo.getDefaultMessage();
        return ResponseEntity.badRequest().body(Map.of("mensaje", mensaje));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<Map<String, String>> cuerpoInvalido() {
        return ResponseEntity.badRequest().body(Map.of("mensaje", "Formato de solicitud inválido."));
    }
}
