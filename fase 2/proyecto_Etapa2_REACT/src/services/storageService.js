/**
 * Servicio genérico de persistencia en localStorage para Ferretería Los Maestros
 */

const STORAGE_PREFIX = 'los_maestros_';

export const storageService = {
  /**
   * Obtiene un valor desde localStorage
   * @param {string} key 
   * @param {*} defaultValue 
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const fullKey = STORAGE_PREFIX + key;
      const data = localStorage.getItem(fullKey);
      if (data === null || data === undefined) {
        return defaultValue;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(defaultValue) && !Array.isArray(parsed) ? defaultValue : parsed;
    } catch (error) {
      console.error(`Error al leer ${key} desde localStorage:`, error);
      return defaultValue;
    }
  },

  /**
   * Guarda un valor en localStorage
   * @param {string} key 
   * @param {*} value 
   */
  set(key, value) {
    try {
      const fullKey = STORAGE_PREFIX + key;
      localStorage.setItem(fullKey, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error al escribir ${key} en localStorage:`, error);
      throw new Error('No fue posible guardar los cambios en este navegador.');
    }
  },

  /**
   * Elimina una clave de localStorage
   * @param {string} key 
   */
  remove(key) {
    try {
      const fullKey = STORAGE_PREFIX + key;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`Error al eliminar ${key} de localStorage:`, error);
    }
  },

  /**
   * Inicializa una clave con datos semilla si no existe previamente
   * @param {string} key 
   * @param {*} seedData 
   * @returns {*} Los datos actuales o los recién inicializados
   */
  init(key, seedData) {
    const existing = this.get(key, null);
    if (existing === null || (Array.isArray(seedData) && !Array.isArray(existing))) {
      this.set(key, seedData);
      return JSON.parse(JSON.stringify(seedData));
    }
    return existing;
  },

  /**
   * Limpia todas las claves del prefijo de la ferretería
   */
  setMany(values) {
    const previous = Object.keys(values).map(key => [key, localStorage.getItem(STORAGE_PREFIX + key)]);
    try {
      Object.entries(values).forEach(([key, value]) => this.set(key, value));
    } catch (error) {
      previous.forEach(([key, value]) => {
        try {
          if (value === null) localStorage.removeItem(STORAGE_PREFIX + key);
          else localStorage.setItem(STORAGE_PREFIX + key, value);
        } catch { /* El navegador puede haber bloqueado todo acceso al almacenamiento. */ }
      });
      throw error;
    }
  },

  clearAll() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (error) {
      console.error('Error al limpiar localStorage de la ferretería:', error);
    }
  }
};
