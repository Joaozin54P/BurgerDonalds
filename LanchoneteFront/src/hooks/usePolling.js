import { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

// roda fn agora e a cada `ms` enquanto a tela estiver aberta
export function usePolling(fn, ms = 5000) {
  const { say } = useToast();
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    let vivo = true;
    const run = () => ref.current().catch((x) => vivo && say(x.message));
    run();
    const i = setInterval(run, ms);
    return () => { vivo = false; clearInterval(i); };
  }, [ms, say]);
}
