import { request } from './api';

// o token vem num cookie HttpOnly (Set-Cookie); o corpo só traz { nome, perfil }
export const login = (email, senha) => request('/auth/login', 'POST', { email, senha });
export const registrar = (nome, email, senha) => request('/auth/registrar', 'POST', { nome, email, senha });
// o cookie é HttpOnly: só o servidor consegue apagá-lo
export const logout = () => request('/auth/logout', 'POST');
