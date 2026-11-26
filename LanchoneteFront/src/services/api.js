import { API_URL } from '../config';

let aoExpirar = () => {};
export const setAoExpirar = (fn) => { aoExpirar = fn; };

// "Geração" da sessão: sobe a cada login. Uma resposta 401 que pertence a uma requisição
// disparada ANTES do login (ex.: polling que estava no ar sem cookie) não pode derrubar
// o usuário que acabou de entrar.
let geracaoSessao = 0;
export const novaSessao = () => { geracaoSessao += 1; };

// Todas as chamadas passam pelo gateway (API_URL).
// Na web em produção API_URL é '/api' (proxy da Vercel), então o cookie é first-party.
// O login guarda o token num cookie HttpOnly: o navegador/app reenvia sozinho,
// desde que a chamada use credentials: 'include'.
// cache: 'no-store' impede o navegador de guardar (e reaproveitar) respostas, inclusive 401.
export async function request(path, method = 'GET', body, extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  const geracao = geracaoSessao;

  let r;
  try {
    r = await fetch(API_URL + path, {
      method,
      headers,
      credentials: 'include',
      cache: 'no-store',
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Error(`Gateway fora do ar (${API_URL}). Se estiver no Render, aguarde alguns segundos para o servidor acordar e tente novamente.`);
  }
  const t = await r.text();
  let j = null;
  try { j = t ? JSON.parse(t) : null; } catch {}

  if (r.status === 401 && path !== '/auth/login' && path !== '/auth/logout') {
    if (geracao === geracaoSessao) aoExpirar();
    throw Error('Sessão expirada, entre de novo.');
  }
  if (!r.ok) throw Error(j?.erro || 'Erro ' + r.status);
  return j;
}