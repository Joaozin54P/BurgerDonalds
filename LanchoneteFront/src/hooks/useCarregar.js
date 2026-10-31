import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

// carrega dados ao abrir e devolve `acao`: executa, avisa e recarrega a lista
export function useCarregar(buscar) {
  const { say } = useToast();
  const [dados, setDados] = useState(null);

  const carregar = useCallback(async () => {
    try { setDados(await buscar()); } catch (x) { say(x.message); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { carregar(); }, [carregar]);

  const acao = async (fn, ok) => {
    try { await fn(); say(ok); await carregar(); return true; }
    catch (x) { say(x.message); return false; }
  };
  return { dados, acao };
}
