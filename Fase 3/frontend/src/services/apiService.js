export async function apiRequest(url, { method = 'GET', data, token = localStorage.getItem('auth_token') } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        ...(data ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal
    });
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 401 && token) {
        window.dispatchEvent(new CustomEvent('auth-expired', { detail: token }));
      }
      const error = new Error(body?.mensaje || (response.status === 401
        ? 'La sesión venció o las credenciales son inválidas.'
        : 'No se pudo completar la operación. Intenta nuevamente.'));
      error.status = response.status;
      throw error;
    }
    if (response.status !== 204 && body === null) {
      throw new Error('La respuesta del servidor no es válida. Intenta nuevamente.');
    }
    return body;
  } catch (error) {
    if (!response) throw new Error('No se pudo conectar con el servidor. Intenta nuevamente.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
