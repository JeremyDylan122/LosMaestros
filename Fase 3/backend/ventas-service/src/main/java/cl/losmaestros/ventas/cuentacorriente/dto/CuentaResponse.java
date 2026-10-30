package cl.losmaestros.ventas.cuentacorriente.dto;
import java.math.BigDecimal;
import cl.losmaestros.ventas.cuentacorriente.entity.CuentaCorriente;
public record CuentaResponse(long usuarioId, boolean activa, BigDecimal creditoMaximo,
        BigDecimal saldoPendiente, BigDecimal creditoDisponible) {
    public static CuentaResponse de(CuentaCorriente c) {
        return new CuentaResponse(c.usuarioId,c.activa,c.creditoMaximo,c.saldoPendiente,c.creditoMaximo.subtract(c.saldoPendiente));
    }
}
