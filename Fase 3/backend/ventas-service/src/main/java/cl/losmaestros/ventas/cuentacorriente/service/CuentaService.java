package cl.losmaestros.ventas.cuentacorriente.service;

import cl.losmaestros.ventas.cuentacorriente.dto.*;
import cl.losmaestros.ventas.cuentacorriente.entity.CuentaCorriente;
import cl.losmaestros.ventas.cuentacorriente.repository.CuentaRepository;
import cl.losmaestros.ventas.exception.NegocioException;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
public class CuentaService {
    private final CuentaRepository cuentas;
    private final ObjectProvider<UsuariosContratistas> usuarios;
    public CuentaService(CuentaRepository cuentas, ObjectProvider<UsuariosContratistas> usuarios) {
        this.cuentas=cuentas; this.usuarios=usuarios;
    }
    @Transactional(readOnly=true)
    public CuentaResponse consultar(long id) {
        return CuentaResponse.de(cuentas.findById(id).orElseThrow(() -> NegocioException.noExiste("No tienes cuenta corriente habilitada.")));
    }
    @Transactional
    public CuentaResponse configurar(long id, ConfigurarCuentaRequest r) {
        var verificador=usuarios.getIfAvailable();
        if (verificador==null) throw NegocioException.dependencia("Falta conectar la verificación de usuarios de Martín.");
        if (!verificador.esContratistaActivo(id)) throw NegocioException.conflicto("El usuario no es un contratista activo.");
        var c=cuentas.bloquear(id).orElseGet(() -> { var nueva=new CuentaCorriente(); nueva.usuarioId=id; return nueva; });
        if (r.creditoMaximo().compareTo(c.saldoPendiente)<0) throw NegocioException.conflicto("El cupo no puede ser menor a la deuda actual.");
        c.activa=r.activa(); c.creditoMaximo=r.creditoMaximo();
        return CuentaResponse.de(cuentas.saveAndFlush(c));
    }
    @Transactional(propagation=org.springframework.transaction.annotation.Propagation.MANDATORY)
    public void cargar(long id, BigDecimal monto) {
        var c=cuentas.bloquear(id).orElseThrow(() -> NegocioException.conflicto("No tienes cuenta corriente."));
        if (!c.activa || c.saldoPendiente.add(monto).compareTo(c.creditoMaximo)>0)
            throw NegocioException.conflicto("Cuenta inactiva o crédito insuficiente, incluido el despacho.");
        c.saldoPendiente=c.saldoPendiente.add(monto);
    }
    @Transactional(propagation=org.springframework.transaction.annotation.Propagation.MANDATORY)
    public void restituir(long id, BigDecimal monto) {
        var c=cuentas.bloquear(id).orElseThrow(() -> NegocioException.conflicto("No existe la cuenta del pedido."));
        if (c.saldoPendiente.compareTo(monto)<0) throw NegocioException.conflicto("El saldo no permite revertir este cargo.");
        c.saldoPendiente=c.saldoPendiente.subtract(monto);
    }
}
