import { storageService } from './storageService';
import { initialUsers } from '../data/initialUsers';

const STORAGE_KEY = 'users';

export const userService = {
  /**
   * Obtiene la lista de todos los usuarios
   * @returns {Array}
   */
  getUsers() {
    return storageService.init(STORAGE_KEY, initialUsers);
  },

  /**
   * Obtiene un usuario por ID
   * @param {number|string} id 
   * @returns {Object|null}
   */
  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => Number(u.id) === Number(id)) || null;
  },

  /**
   * Obtiene un usuario por su correo electrónico
   * @param {string} email 
   * @returns {Object|null}
   */
  getUserByEmail(email) {
    if (!email) return null;
    const users = this.getUsers();
    return users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase()) || null;
  },

  /**
   * Autentica un usuario con credenciales de acceso
   * @param {string} email 
   * @param {string} password 
   * @returns {Object} Usuario autenticado (sin exponer contraseña sensible si aplica)
   */
  authenticate(email, password) {
    if (!this.validateEmail(email)) {
      throw new Error('El correo ingresado no cumple con el formato o dominios permitidos (@duoc.cl, @profesor.duoc.cl, @gmail.com).');
    }

    if (!password || password.length < 4 || password.length > 10) {
      throw new Error('La contraseña debe tener entre 4 y 10 caracteres.');
    }

    const user = this.getUserByEmail(email);
    if (!user || user.password !== password) {
      throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
    }

    // Retorna usuario autenticado
    const { password: _, ...userSafe } = user;
    return userSafe;
  },

  /**
   * Crea un nuevo usuario en el sistema (CRUD: Create)
   * @param {Object} userData 
   * @returns {Object}
   */
  createUser(userData) {
    const users = this.getUsers();

    // Validar email
    if (!this.validateEmail(userData.email)) {
      throw new Error('Correo inválido. Solo se permiten dominios: @duoc.cl, @profesor.duoc.cl y @gmail.com (máx 100 caracteres).');
    }

    if (this.getUserByEmail(userData.email)) {
      throw new Error(`El correo "${userData.email}" ya se encuentra registrado.`);
    }

    // Validar RUN
    const runValidation = this.validateRun(userData.run);
    if (!runValidation.isValid) {
      throw new Error(runValidation.message);
    }

    // Validar Contraseña
    if (!userData.password || userData.password.length < 4 || userData.password.length > 10) {
      throw new Error('La contraseña debe tener entre 4 y 10 caracteres.');
    }

    const nextId = users.length > 0 ? Math.max(...users.map(u => Number(u.id) || 0)) + 1 : 1;

    const newUser = {
      id: nextId,
      run: runValidation.formatted,
      nombre: userData.nombre.trim(),
      apellidos: userData.apellidos ? userData.apellidos.trim() : '',
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      rol: userData.rol || 'CLIENTE', // ADMIN, VENDEDOR, CONTRATISTA, CLIENTE
      region: userData.region || '',
      comuna: userData.comuna || '',
      direccion: userData.direccion ? userData.direccion.trim() : '',
      empresa: userData.empresa ? userData.empresa.trim() : '',
      cuentaCorrienteActiva: userData.rol === 'CONTRATISTA' ? Boolean(userData.cuentaCorrienteActiva) : false,
      creditoMaximo: userData.rol === 'CONTRATISTA' ? (Number(userData.creditoMaximo) || 2000000) : 0,
      saldoPendiente: Number(userData.saldoPendiente) || 0
    };

    users.push(newUser);
    storageService.set(STORAGE_KEY, users);

    const { password: _, ...userSafe } = newUser;
    return userSafe;
  },

  /**
   * Actualiza los datos de un usuario (CRUD: Update)
   * @param {number|string} id 
   * @param {Object} updatedData 
   * @returns {Object}
   */
  updateUser(id, updatedData) {
    const users = this.getUsers();
    const index = users.findIndex(u => Number(u.id) === Number(id));

    if (index === -1) {
      throw new Error(`Usuario con ID ${id} no encontrado.`);
    }

    // Si cambia email, validar que no esté duplicado
    if (updatedData.email && updatedData.email.toLowerCase() !== users[index].email.toLowerCase()) {
      if (!this.validateEmail(updatedData.email)) {
        throw new Error('El nuevo correo no es válido.');
      }
      const existing = this.getUserByEmail(updatedData.email);
      if (existing && Number(existing.id) !== Number(id)) {
        throw new Error('El nuevo correo ya está en uso por otro usuario.');
      }
    }

    const current = users[index];
    const updatedUser = {
      ...current,
      ...updatedData,
      id: current.id, // Inmutable
      email: updatedData.email ? updatedData.email.trim().toLowerCase() : current.email,
      rol: updatedData.rol || current.rol,
      saldoPendiente: updatedData.saldoPendiente !== undefined ? Number(updatedData.saldoPendiente) : current.saldoPendiente
    };

    users[index] = updatedUser;
    storageService.set(STORAGE_KEY, users);

    const { password: _, ...userSafe } = updatedUser;
    return userSafe;
  },

  /**
   * Elimina un usuario (CRUD: Delete)
   * @param {number|string} id 
   * @returns {boolean}
   */
  deleteUser(id) {
    const users = this.getUsers();
    const filtered = users.filter(u => Number(u.id) !== Number(id));
    if (filtered.length === users.length) return false;
    storageService.set(STORAGE_KEY, filtered);
    return true;
  },

  /**
   * Valida un correo según la regla de negocio del caso:
   * Obligatorio, máx 100 caracteres, y dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com
   * @param {string} email 
   * @returns {boolean}
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const clean = email.trim().toLowerCase();
    if (clean.length === 0 || clean.length > 100) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clean)) return false;

    const parts = clean.split('@');
    if (parts.length !== 2) return false;

    const domain = '@' + parts[1];
    const allowed = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return allowed.includes(domain);
  },

  /**
   * Valida un RUN chileno con algoritmo Módulo 11
   * @param {string} run 
   * @returns {{ isValid: boolean, message: string, formatted: string }}
   */
  validateRun(run) {
    if (!run || typeof run !== 'string') {
      return { isValid: false, message: 'El RUN es obligatorio.', formatted: '' };
    }

    // Limpiar puntos, espacios y guiones
    const clean = run.replace(/[^0-9kK]/g, '').toUpperCase();
    if (clean.length < 7 || clean.length > 9) {
      return { isValid: false, message: 'El RUN debe tener entre 7 y 9 dígitos (ej. 19011022K).', formatted: '' };
    }

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);

    // Calcular dígito verificador mediante Módulo 11
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const mod = 11 - (sum % 11);
    let expectedDv = '0';
    if (mod === 11) expectedDv = '0';
    else if (mod === 10) expectedDv = 'K';
    else expectedDv = mod.toString();

    if (dv !== expectedDv) {
      return { isValid: false, message: 'El dígito verificador del RUN es inválido.', formatted: clean };
    }

    return {
      isValid: true,
      message: 'RUN válido.',
      formatted: `${body}-${dv}`
    };
  }
};
