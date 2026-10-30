package cl.losmaestros.ventas.pedidos.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;

public record Actor(long usuarioId, boolean administrador, boolean vendedor, boolean contratista) {
    public static Actor desde(Authentication auth) {
        try {
            long id = Long.parseLong(auth.getName());
            if (id <= 0) throw new NumberFormatException();
            return new Actor(id, rol(auth, "ADMIN"), rol(auth, "VENDEDOR"), rol(auth, "CONTRATISTA"));
        } catch (NumberFormatException e) {
            throw new AccessDeniedException("El token debe identificar un usuario numérico positivo en sub.");
        }
    }
    private static boolean rol(Authentication a, String rol) {
        return a.getAuthorities().stream().anyMatch(x -> x.getAuthority().equals("ROLE_" + rol));
    }
    public boolean personal() { return administrador || vendedor; }
}
