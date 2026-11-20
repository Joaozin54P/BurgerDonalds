import { Platform } from 'react-native';

// Emulador Android enxerga o PC em 10.0.2.2.
// Celular de verdade: troque pelo IP do seu PC na rede (ex: '192.168.0.15').
export const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

// Na Vercel, lê EXPO_PUBLIC_API_URL (ex: https://burgerdonalds-gateway.onrender.com).
// Localmente, mantém o fallback para localhost:8080.
const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

// O app fala só com o gateway; ele encaminha /auth, /categorias, /produtos, /adicionais, /pedidos
// e /cozinha para o serviço certo.
export const API_URL = envUrl || `http://${HOST}:8080`;