/**
 * Usuarios iniciales para autenticación RBAC
 * Cumpliendo con los roles requeridos en la evaluación: Administrador, Vendedor, Contratista y Cliente.
 */
export const initialUsers = [
  {
    id: 1,
    run: '11222333-9',
    nombre: 'Carlos',
    apellidos: 'Vega Osorio',
    email: 'admin@duoc.cl',
    password: 'admin123',
    rol: 'ADMIN', // Administrador: control total, usuarios, inventario, reportes
    region: 'Región de Coquimbo',
    comuna: 'La Serena',
    direccion: 'Av. Balmaceda 1420',
    empresa: 'Ferretería Los Maestros SpA',
    cuentaCorrienteActiva: false,
    creditoMaximo: 0,
    saldoPendiente: 0
  },
  {
    id: 2,
    run: '14555666-K',
    nombre: 'Ricardo',
    apellidos: 'Valdés Pizarro',
    email: 'vendedor@duoc.cl',
    password: 'vend123',
    rol: 'VENDEDOR', // Vendedor: inventario, órdenes, catálogo (sin gestión de usuarios)
    region: 'Región de Coquimbo',
    comuna: 'Coquimbo',
    direccion: 'Calle Prat 350',
    empresa: 'Ferretería Los Maestros SpA',
    cuentaCorrienteActiva: false,
    creditoMaximo: 0,
    saldoPendiente: 0
  },
  {
    id: 3,
    run: '16888999-2',
    nombre: 'Patricio',
    apellidos: 'Gómez Alarcón',
    email: 'contratista@duoc.cl',
    password: 'contra123',
    rol: 'CONTRATISTA', // Contratista: compras al por mayor, línea de crédito a fin de mes
    region: 'Región de Coquimbo',
    comuna: 'La Serena',
    direccion: 'Faena Condominio Las Pircas, Lote 14',
    empresa: 'Constructora Elqui & Cía Ltda.',
    cuentaCorrienteActiva: true,
    creditoMaximo: 3500000,
    saldoPendiente: 450000
  },
  {
    id: 4,
    run: '18333444-1',
    nombre: 'Andrea',
    apellidos: 'Soto Morales',
    email: 'cliente@gmail.com',
    password: 'clie123',
    rol: 'CLIENTE', // Cliente particular
    region: 'Región de Coquimbo',
    comuna: 'La Serena',
    direccion: 'Población San Joaquín, Pasaje Los Copihues 45',
    empresa: '',
    cuentaCorrienteActiva: false,
    creditoMaximo: 0,
    saldoPendiente: 0
  }
];
