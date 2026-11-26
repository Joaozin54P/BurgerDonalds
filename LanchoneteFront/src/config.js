import { Platform } from 'react-native';

// Emulador Android enxerga o PC em 10.0.2.2.
// Celular de verdade: troque pelo IP do seu PC na rede (ex: '192.168.0.15').
export const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

// Só vale em desenvolvimento / mobile nativo (ex: http://192.168.0.15:8080).
// Na web em produção essa variável é ignorada: o app usa o proxy /api da Vercel.
const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

// Web em produção (Vercel): o navegador fala com o PRÓPRIO domínio do front em /api e o
// vercel.json repassa para o gateway no Render. Assim o cookie `token` vira first-party
// (mesmo domínio da página) e navegadores restritivos, como o DuckDuckGo, aceitam.
const emWeb = Platform.OS === 'web';
const emDev = typeof __DEV__ !== 'undefined' && __DEV__;
const hostname = emWeb && typeof window !== 'undefined' ? window.location.hostname : '';
const emLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(hostname);

export const USA_PROXY = emWeb && !emDev && !emLocalhost;

// O app fala só com o gateway; ele encaminha /auth, /categorias, /produtos, /adicionais, /pedidos
// e /cozinha para o serviço certo.
export const API_URL = USA_PROXY ? '/api' : envUrl || `http://${HOST}:8080`;