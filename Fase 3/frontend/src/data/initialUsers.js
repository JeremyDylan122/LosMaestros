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
    passwordHash: '3fa898507b891d6c358b930e728e26ba1bb65678f95c2c49521618494d0dc5b4',
    passwordSalt: '3920646a63c7696db2d7a568cfcb2832',
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
    passwordHash: '94d72a30e33e8fa01e845431f05dca529a93a1e2ba9a5f4d08917b5d265787b0',
    passwordSalt: '550ac3332639c8173212a0a88b9fc1e4',
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
    passwordHash: 'b45d538e119e4b23536bc1d52f599fdd0e0c4d21d4e7b7abf0ce230480fb32e3',
    passwordSalt: '1391c8eec80a47e762764534757c638c',
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
    passwordHash: '5799e54922fc6dc5406938e1e3c4cbdbcede671412b92a0985f432cc111f2916',
    passwordSalt: '2037e1aa83e876d60748f03048924278',
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
