package cl.losmaestros.ventas.exception;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.ConcurrencyFailureException;

@RestControllerAdvice(basePackages = {"cl.losmaestros.ventas.pedidos.controller", "cl.losmaestros.ventas.cuentacorriente.controller"})
public class ErroresPedidos {
    @ExceptionHandler(NegocioException.class)
    ResponseEntity<?> negocio(NegocioException e) {
        return ResponseEntity.status(e.estado).body(Map.of("mensaje", e.getMessage()));
    }
    @ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class})
    ResponseEntity<?> invalido(Exception e) {
        return ResponseEntity.badRequest().body(Map.of("mensaje", "Petición inválida. Revisa cantidades, campos y valores permitidos."));
    }
    @ExceptionHandler({DataIntegrityViolationException.class, ConcurrencyFailureException.class})
    ResponseEntity<?> conflicto(Exception e) {
        return ResponseEntity.status(409).body(Map.of("mensaje", "Los datos cambiaron o entraron en conflicto. Actualiza antes de reintentar."));
    }
}
