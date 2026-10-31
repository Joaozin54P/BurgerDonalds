import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setAoExpirar } from '../services/api';
import * as authService from '../services/authService';
import { useToast } from './ToastContext';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const { say } = useToast();
  const [user, setUser] = useState(null); // { nome, perfil }
  const [loginAberto, setLoginAberto] = useState(false);

  // sessão expirada: o cookie já não vale mais, basta limpar a tela
  const limpar = useCallback(() => setUser(null), []);
  useEffect(() => { setAoExpirar(limpar); }, [limpar]);

  // sair: pede ao servidor para apagar o cookie HttpOnly (o front não consegue apagá-lo sozinho)
  const sair = useCallback(async () => {
    try { await authService.logout(); } catch {}
    setUser(null);
  }, []);

  const entrar = async (email, senha) => {
    const r = await authService.login(email, senha);
    setUser({ nome: r.nome, perfil: r.perfil });
    setLoginAberto(false);
    say('Bem-vindo, ' + r.nome.split(' ')[0] + '!');
  };
  const cadastrar = async (nome, email, senha) => {
    await authService.registrar(nome, email, senha);
    await entrar(email, senha);
  };

  const staff = !!user && ['COZINHA', 'ADMIN'].includes(user.perfil);
  const admin = user?.perfil === 'ADMIN';
  return (
    <Ctx.Provider value={{ user, staff, admin, entrar, cadastrar, sair, loginAberto,
      abrirLogin: () => setLoginAberto(true), fecharLogin: () => setLoginAberto(false) }}>
      {children}
    </Ctx.Provider>
  );
}
