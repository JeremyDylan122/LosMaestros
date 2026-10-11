import { describe, it, expect, beforeEach } from 'vitest';
import { userService } from '../../services/userService';
import { storageService } from '../../services/storageService';

describe('Servicio de Usuarios (userService)', () => {
  beforeEach(() => {
    storageService.clearAll();
  });

  describe('Reglas de Validación de Correo Institucional', () => {
    it('debe aceptar correos válidos con dominio @duoc.cl', () => {
      expect(userService.validateEmail('alumno@duoc.cl')).toBe(true);
    });

    it('debe aceptar correos con dominio @profesor.duoc.cl', () => {
      expect(userService.validateEmail('docente@profesor.duoc.cl')).toBe(true);
    });

    it('debe aceptar correos con dominio @gmail.com', () => {
      expect(userService.validateEmail('cliente.obra@gmail.com')).toBe(true);
    });

    it('debe rechazar correos con otros dominios como @hotmail.com o @yahoo.es', () => {
      expect(userService.validateEmail('usuario@hotmail.com')).toBe(false);
      expect(userService.validateEmail('usuario@yahoo.es')).toBe(false);
      expect(userService.validateEmail('usuario@outlook.com')).toBe(false);
    });

    it('debe rechazar correos vacíos o mayores a 100 caracteres', () => {
      expect(userService.validateEmail('')).toBe(false);
      expect(userService.validateEmail(null)).toBe(false);
      const longEmail = 'a'.repeat(95) + '@duoc.cl';
      expect(userService.validateEmail(longEmail)).toBe(false);
    });
  });

  describe('Reglas de Validación de RUN Chileno (Módulo 11)', () => {
    it('debe validar correctamente un RUN chileno real con dígito verificador numérico', () => {
      // 11.111.111-1
      const result = userService.validateRun('111111111');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('11111111-1');
    });

    it('debe validar correctamente un RUN chileno con dígito verificador K', () => {
      // 10.000.013-K
      const result = userService.validateRun('10000013K');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('10000013-K');
    });

    it('debe rechazar un RUN con dígito verificador erróneo', () => {
      const result = userService.validateRun('111111119');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('dígito verificador');
    });

    it('debe rechazar RUNs con menos de 7 o más de 9 caracteres', () => {
      const shortRun = userService.validateRun('12345');
      const longRun = userService.validateRun('12345678901');
      expect(shortRun.isValid).toBe(false);
      expect(longRun.isValid).toBe(false);
    });
  });

  describe('Autenticación y CRUD de Usuarios', () => {
    it('debe autenticar exitosamente a un usuario con credenciales correctas', () => {
      const user = userService.authenticate('admin@duoc.cl', 'admin123');
      expect(user).toBeDefined();
      expect(user.email).toBe('admin@duoc.cl');
      expect(user.rol).toBe('ADMIN');
      expect(user.password).toBeUndefined();
    });

    it('debe lanzar error al intentar autenticar con contraseña errónea', () => {
      expect(() => {
        userService.authenticate('admin@duoc.cl', 'error1');
      }).toThrow('Credenciales inválidas');
    });

    it('debe crear un nuevo usuario y persistirlo en la lista', () => {
      const newUser = userService.createUser({
        run: '123456785', // 12.345.678-5 (Válido Módulo 11)
        nombre: 'Pedro',
        apellidos: 'Valenzuela',
        email: 'pedro.nuevo@duoc.cl',
        password: 'pass123',
        rol: 'CLIENTE',
        region: 'Región de Coquimbo',
        comuna: 'La Serena',
        direccion: 'Calle Los Álamos 120'
      });

      expect(newUser.id).toBeDefined();
      expect(newUser.email).toBe('pedro.nuevo@duoc.cl');

      const found = userService.getUserByEmail('pedro.nuevo@duoc.cl');
      expect(found).not.toBeNull();
      expect(found.nombre).toBe('Pedro');
    });

    it('debe actualizar los datos de un usuario existente', () => {
      const users = userService.getUsers();
      const first = users[0];

      const updated = userService.updateUser(first.id, {
        nombre: 'Carlos Modificado',
        saldoPendiente: 50000
      });

      expect(updated.nombre).toBe('Carlos Modificado');
      expect(updated.saldoPendiente).toBe(50000);
    });

    it('debe eliminar un usuario existente', () => {
      const users = userService.getUsers();
      const userToDelete = users[users.length - 1];

      const deleted = userService.deleteUser(userToDelete.id);
      expect(deleted).toBe(true);

      const search = userService.getUserById(userToDelete.id);
      expect(search).toBeNull();
    });
  });
});
