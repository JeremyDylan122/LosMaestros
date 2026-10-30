package cl.losmaestros.ventas.cuentacorriente.dto;
import java.math.BigDecimal;
import jakarta.validation.constraints.*;
public record ConfigurarCuentaRequest(boolean activa,
    @NotNull @DecimalMin("0") @Digits(integer=12,fraction=2) BigDecimal creditoMaximo) {}
