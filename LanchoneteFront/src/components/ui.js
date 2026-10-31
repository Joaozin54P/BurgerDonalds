import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, ScrollView, Platform, StyleSheet } from 'react-native';
import { C, RAD, common, sombra } from '../theme';
import { STATUS, LBL, iniciais } from '../utils';
import { useLayout } from '../hooks/useLayout';
import { ToastBubble } from '../context/ToastContext';

// kinds: orange (principal), dark, light (branco com borda), danger (texto vermelho).
// 'red', 'y' e 'g' são os nomes antigos e continuam funcionando.
const KIND = {
  orange: { bg: C.orange, hover: C.orangeDark, fg: '#fff', br: C.orange },
  dark: { bg: C.ink, hover: C.ink2, fg: '#FBF8F1', br: C.ink },
  light: { bg: '#fff', hover: C.cream, fg: C.ink, br: C.line },
  danger: { bg: '#fff', hover: C.redBg, fg: C.red, br: C.line },
};
const LEGACY = { red: 'orange', g: 'orange', y: 'light' };

export const Btn = ({ children, onPress, kind = 'orange', small, disabled, style }) => {
  const k = KIND[LEGACY[kind] || kind] || KIND.orange;
  return (
    <Pressable onPress={onPress} disabled={disabled}
      style={({ pressed, hovered }) => [s.btn, small && s.btnS, { backgroundColor: pressed || hovered ? k.hover : k.bg, borderColor: k.br },
        pressed && { transform: [{ scale: 0.98 }] }, disabled && { opacity: 0.5 }, style]}>
      <Text style={[s.btnT, small && s.btnTS, { color: k.fg }]}>{children}</Text>
    </Pressable>
  );
};

export const Input = ({ style, onFocus, onBlur, ...p }) => {
  const [foco, setFoco] = useState(false);
  return (
    <TextInput placeholderTextColor={C.mute} {...p}
      onFocus={(e) => { setFoco(true); onFocus?.(e); }}
      onBlur={(e) => { setFoco(false); onBlur?.(e); }}
      style={[s.input, p.multiline && { minHeight: 76, textAlignVertical: 'top' }, foco && s.inputFoco, style]} />
  );
};

// "comprimidos" de escolha: categorias, formas de pagamento, perfis...
export const Chip = ({ label, ativo, onPress, style }) => (
  <Pressable onPress={onPress} style={({ hovered }) => [s.chip, ativo && s.chipOn, !ativo && hovered && { backgroundColor: C.cream }, style]}>
    <Text style={[s.chipT, ativo && { color: '#FBF8F1' }]}>{label}</Text>
  </Pressable>
);

export const StatusPill = ({ status }) => {
  const st = STATUS[status] || STATUS.CRIADO;
  return (
    <View style={[s.pill, { backgroundColor: st.bg }]}>
      <View style={[s.pillDot, { backgroundColor: st.dot }]} />
      <Text style={[s.pillT, { color: st.fg }]}>{LBL[status] ?? status}</Text>
    </View>
  );
};

export const Avatar = ({ nome, size = 36 }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.peach, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: C.orangeDark, fontWeight: '800', fontSize: size * 0.36 }}>{iniciais(nome) || '?'}</Text>
  </View>
);

export const Qtd = ({ valor, onMenos, onMais }) => (
  <View style={s.qtd}>
    <Pressable onPress={onMenos} style={s.qtdB} accessibilityLabel="menos"><Text style={s.qtdT}>−</Text></Pressable>
    <Text style={s.qtdN}>{valor}</Text>
    <Pressable onPress={onMais} style={s.qtdB} accessibilityLabel="mais"><Text style={s.qtdT}>+</Text></Pressable>
  </View>
);

export const Check = ({ on }) => (
  <View style={[s.check, on && { backgroundColor: C.orange, borderColor: C.orange }]}>
    {on && <Text style={{ color: '#fff', fontSize: 13, fontWeight: '900', lineHeight: 15 }}>✓</Text>}
  </View>
);

export const PageHeader = ({ eyebrow, titulo, sub, direita }) => {
  const { compact } = useLayout();
  return (
    <View style={[s.pageH, compact && { marginTop: 18 }]}>
      <View style={{ flex: 1 }}>
        {!!eyebrow && <Text style={common.eyebrow}>{eyebrow}</Text>}
        <Text style={[common.h1, compact && { fontSize: 28 }]}>{titulo}</Text>
        {!!sub && <Text style={[common.body, { marginTop: 4 }]}>{sub}</Text>}
      </View>
      {direita}
    </View>
  );
};

// Janela por cima da tela: "gaveta" no celular e janela central no computador
export const Sheet = ({ onClose, children }) => {
  const { wide } = useLayout();
  return (
    <Modal transparent animationType={wide ? 'fade' : 'slide'} onRequestClose={onClose}>
      <Pressable style={[s.overlay, wide && s.overlayWide]} onPress={onClose}>
        <Pressable style={[s.sheet, wide ? s.sheetWide : s.sheetMobile]}>
          {!wide && <View style={s.grab} />}
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 6 }}>
            {children}
          </ScrollView>
        </Pressable>
        <ToastBubble />
      </Pressable>
    </Modal>
  );
};

const semContorno = Platform.OS === 'web' ? { outlineStyle: 'none' } : {};

const s = StyleSheet.create({
  btn: { borderWidth: 1, borderRadius: RAD.md, paddingVertical: 13, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  btnS: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 11 },
  btnT: { fontWeight: '800', fontSize: 15, letterSpacing: -0.1 },
  btnTS: { fontSize: 13 },
  input: { ...semContorno, borderWidth: 1, borderColor: C.line, borderRadius: RAD.md, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 14, marginVertical: 5, fontSize: 15, color: C.ink },
  inputFoco: { borderColor: C.orange, boxShadow: '0 0 0 3px rgba(224,80,42,0.14)' },
  chip: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 99, paddingVertical: 9, paddingHorizontal: 16 },
  chipOn: { backgroundColor: C.ink, borderColor: C.ink },
  chipT: { fontWeight: '700', fontSize: 14, color: C.ink },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 99, paddingVertical: 5, paddingHorizontal: 11, alignSelf: 'flex-start' },
  pillDot: { width: 6, height: 6, borderRadius: 3 },
  pillT: { fontWeight: '800', fontSize: 12 },
  qtd: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.line, borderRadius: 99, backgroundColor: '#fff' },
  qtdB: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  qtdT: { fontSize: 22, fontWeight: '700', color: C.ink, lineHeight: 24 },
  qtdN: { minWidth: 26, textAlign: 'center', fontSize: 17, fontWeight: '800', color: C.ink },
  check: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: '#CFC8B6', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  pageH: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginTop: 30, marginBottom: 20 },
  overlay: { flex: 1, backgroundColor: 'rgba(39,38,31,0.55)', justifyContent: 'flex-end' },
  overlayWide: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  sheet: { backgroundColor: C.cream, maxHeight: '90%' },
  sheetMobile: { borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
  sheetWide: { ...sombra, width: '100%', maxWidth: 520, maxHeight: '88%', borderRadius: 26, padding: 26 },
  grab: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#D8D2C2', marginBottom: 12 },
});
