import { StyleSheet } from 'react-native';

// Paleta do BurgerDonalds: carvão (barra e destaques), creme (fundo) e laranja-brasa (ações).
export const C = {
  ink: '#27261F', ink2: '#38372E', ink3: '#4B4A40',
  cream: '#F5F2EB', paper: '#FFFFFF', line: '#E8E3D6', lineSoft: '#EFEBE0',
  text: '#27261F', mid: '#5F5B50', mute: '#8E897B',
  orange: '#E0502A', orangeDark: '#C4411F', peach: '#FCE8DE', peachLine: '#F4CDB9',
  green: '#3E7C4D', greenBg: '#E4EFDF',
  amber: '#9A6212', amberBg: '#FBEFD6', amberDot: '#E8A03A',
  red: '#B3261E', redBg: '#F9E0DD',
};

export const RAD = { sm: 10, md: 14, lg: 20, xl: 26 };

// sombras suaves (boxShadow funciona no app e na web)
export const sombra = { boxShadow: '0 8px 24px rgba(39,38,31,0.07)' };
export const sombraLeve = { boxShadow: '0 2px 8px rgba(39,38,31,0.05)' };

// estilos usados em mais de uma tela
export const common = StyleSheet.create({
  eyebrow: { color: C.orange, fontSize: 11, fontWeight: '800', letterSpacing: 1.3, textTransform: 'uppercase' },
  h1: { color: C.ink, fontSize: 34, fontWeight: '800', letterSpacing: -0.9 },
  h2: { color: C.ink, fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  h3: { color: C.ink, fontSize: 17, fontWeight: '800', letterSpacing: -0.2 },
  body: { color: C.mid, fontSize: 14, lineHeight: 20 },
  muted: { color: C.mute, fontSize: 13 },
  card: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: RAD.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  sheetH: { color: C.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.6, marginBottom: 12 },
  itTxt: { color: C.ink, fontWeight: '700', fontSize: 15 },
  price: { color: C.ink, fontWeight: '800', fontSize: 17, letterSpacing: -0.2 },
  empty: { alignItems: 'center', padding: 48, gap: 8 },
  emptyIco: { fontSize: 44 },
  label: { color: C.mid, fontSize: 12, fontWeight: '700', marginTop: 10, marginBottom: 2 },
  divider: { height: 1, backgroundColor: C.lineSoft, marginVertical: 12 },
});
