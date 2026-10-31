import { request } from './api';

export async function carregar() {
  const [categorias, produtos, adicionais] = await Promise.all([
    request('/categorias'),
    request('/produtos'),
    request('/adicionais'),
  ]);
  return { categorias, produtos, adicionais };
}
