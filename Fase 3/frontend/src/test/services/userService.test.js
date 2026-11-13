import { expect, it } from 'vitest';
import { userService } from '../../services/userService';

// Martín: dominios admitidos para el registro.
it('acepta los dominios de correo permitidos y rechaza uno ajeno', () => {
  expect(userService.validateEmail('alumno@duoc.cl')).toBe(true);
  expect(userService.validateEmail('docente@profesor.duoc.cl')).toBe(true);
  expect(userService.validateEmail('cliente@gmail.com')).toBe(true);
  expect(userService.validateEmail('cliente@hotmail.com')).toBe(false);
});
