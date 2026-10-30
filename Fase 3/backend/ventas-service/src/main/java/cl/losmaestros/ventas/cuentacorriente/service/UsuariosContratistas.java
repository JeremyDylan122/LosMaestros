package cl.losmaestros.ventas.cuentacorriente.service;

/** Contrato de Martín: consultar usuario existente, activo y CONTRATISTA por canal autenticado. */
public interface UsuariosContratistas {
    boolean esContratistaActivo(long usuarioId);
}
