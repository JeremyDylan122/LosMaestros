package cl.losmaestros.ventas.cuentacorriente.controller;

import cl.losmaestros.ventas.cuentacorriente.dto.*;
import cl.losmaestros.ventas.cuentacorriente.service.CuentaService;
import cl.losmaestros.ventas.pedidos.service.Actor;
import cl.losmaestros.ventas.exception.NegocioException;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cuentas-corrientes")
public class CuentaController {
    private final CuentaService cuentas;
    public CuentaController(CuentaService cuentas) { this.cuentas=cuentas; }
    @GetMapping("/me")
    public CuentaResponse propia(Authentication auth) { return cuentas.consultar(Actor.desde(auth).usuarioId()); }
    @PutMapping("/{usuarioId}")
    public CuentaResponse configurar(@PathVariable long usuarioId,@Valid @RequestBody ConfigurarCuentaRequest r) {
        if (usuarioId<=0) throw NegocioException.conflicto("Usuario inválido.");
        return cuentas.configurar(usuarioId,r);
    }
}
