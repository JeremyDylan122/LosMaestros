// Protección local de la demo. No sustituye autenticación y autorización en un servidor.
const iterations = 100000;
const hex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
export const credentialService = {
  async hash(password, salt = hex(crypto.getRandomValues(new Uint8Array(16)))) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations, hash: 'SHA-256' }, key, 256);
    return { passwordHash: hex(new Uint8Array(bits)), passwordSalt: salt };
  },
  async verify(password, user) {
    if (!user?.passwordHash || !user?.passwordSalt) return false;
    const result = await this.hash(password, user.passwordSalt);
    return result.passwordHash === user.passwordHash;
  },
  safe(user) {
    if (!user) return null;
    const { password: _password, passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...safe } = user;
    return safe;
  }
};
