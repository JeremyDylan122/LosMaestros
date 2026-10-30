package cl.losmaestros.ventas.pedidos.controller;

import cl.losmaestros.ventas.pedidos.dto.*;
import cl.losmaestros.ventas.pedidos.service.*;
import cl.losmaestros.ventas.pedidos.entity.Pedido.Estado;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;

@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoController {
    private final PedidoService servicio;
    public PedidoController(PedidoService servicio) { this.servicio=servicio; }
    @PostMapping
    public ResponseEntity<PedidoResponse> comprar(Authentication auth,@Valid @RequestBody CompraRequest r) {
        var pedido=servicio.comprar(Actor.desde(auth),r);
        return ResponseEntity.created(URI.create("/api/v1/pedidos/"+pedido.id())).body(pedido);
    }
    @GetMapping
    public Page<PedidoResponse> listar(Authentication auth,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size) {
        return servicio.listar(Actor.desde(auth),page,size);
    }
    @GetMapping("/{id}")
    public PedidoResponse consultar(Authentication auth,@PathVariable long id) { return servicio.consultar(Actor.desde(auth),id); }
    public record CambioEstado(@NotNull Estado estado) {}
    @PatchMapping("/{id}/estado")
    public PedidoResponse estado(Authentication auth,@PathVariable long id,@Valid @RequestBody CambioEstado r) {
        return servicio.cambiarEstado(Actor.desde(auth),id,r.estado());
    }
}
