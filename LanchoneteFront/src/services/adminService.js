import { request } from './api';

// CRUD padrão do servicoCardapio (só ADMIN escreve; GET é público)
const crud = (path) => ({
  listar: () => request(path),
  salvar: (id, dados) => (id ? request(`${path}/${id}`, 'PUT', dados) : request(path, 'POST', dados)),
  excluir: (id) => request(`${path}/${id}`, 'DELETE'),
});

export const produtos = {
  ...crud('/produtos'),
  // "acabou o bacon": tira do cardápio sem apagar
  disponibilidade: (id, disponivel) => request(`/produtos/${id}/disponibilidade`, 'PATCH', { disponivel }),
};
export const categorias = crud('/categorias');
export const adicionais = crud('/adicionais');

// servicoLogin: ADMIN cria funcionário (COZINHA) ou outro ADMIN
export const criarUsuario = (nome, email, senha, perfil) =>
  request('/auth/usuarios', 'POST', { nome, email, senha, perfil });
