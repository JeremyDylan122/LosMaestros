package cl.losmaestros.ventas.cuentacorriente.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="cuentas_corrientes")
public class CuentaCorriente {
    @Id public Long usuarioId;
    @Version public long version;
    public boolean activa;
    @Column(nullable=false, precision=19, scale=2) public BigDecimal creditoMaximo = BigDecimal.ZERO;
    @Column(nullable=false, precision=19, scale=2) public BigDecimal saldoPendiente = BigDecimal.ZERO;
}
