import { API_URL } from '../config';

let aoExpirar = () => {};
export const setAoExpirar = (fn) => { aoExpirar = fn; };

// Todas as chamadas passam pelo gateway (API_URL).
// O login agora guarda o token num cookie HttpOnly: o navegador/app reenvia sozinho,
// desde que a chamada use credentials: 'include' (sem isso, na web, o cookie é ignorado).
export async function request(path, method = 'GET', body, extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };

  let r;
  try {
    r = await fetch(API_URL + path, {
      method,
      headers,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Error('Gateway fora do ar. Confira o HOST em src/config.js e se ele está rodando na porta 8080.');
  }
  const t = await r.text();
  let j = null;
  try { j = t ? JSON.parse(t) : null; } catch {}

  if (r.status === 401 && path !== '/auth/login' && path !== '/auth/logout') {
    aoExpirar();
    throw Error('Sessão expirada, entre de novo.');
  }
  if (!r.ok) throw Error(j?.erro || 'Erro ' + r.status);
  return j;
}
