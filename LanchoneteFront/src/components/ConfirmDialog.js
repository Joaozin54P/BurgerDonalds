import React, { useState, useEffect } from 'react';
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { Btn } from './ui';
import { C, common, sombra } from '../theme';

// Confirmação no estilo do app (no lugar do alert/confirm do navegador).
// Uso: pedirConfirmacao({ msg: 'Excluir "X"?', onOk: () => ... })
// O <ConfirmHost /> fica uma vez só no App.js e mostra a janela.
let abrir = null;
export const pedirConfirmacao = (opcoes) => abrir?.(opcoes);

export default function ConfirmHost() {
  const [d, setD] = useState(null);
  useEffect(() => { abrir = setD; return () => { abrir = null; }; }, []);
  if (!d) return null;

  const fechar = () => setD(null);
  const confirmar = () => { const fn = d.onOk; fechar(); fn?.(); };

  return (
    <Modal transparent animationType="fade" onRequestClose={fechar}>
      <Pressable style={s.fundo} onPress={fechar}>
        <Pressable style={[s.cartao, sombra]}>
          <View style={s.icone}><Text style={s.iconeT}>🗑️</Text></View>
          <Text style={[common.eyebrow, { textAlign: 'center' }]}>{d.eyebrow || 'Confirmar exclusão'}</Text>
          <Text style={s.titulo}>{d.titulo || 'Tem certeza?'}</Text>
          <Text style={s.msg}>{d.msg}</Text>
          <View style={s.botoes}>
            <Btn kind="light" onPress={fechar} style={s.botao}>Cancelar</Btn>
            <Btn kind="orange" onPress={confirmar} style={s.botao}>{d.confirmar || 'Sim, excluir'}</Btn>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(39,38,31,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  cartao: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 24, padding: 26, alignItems: 'stretch' },
  icone: { alignSelf: 'center', width: 64, height: 64, borderRadius: 32, backgroundColor: C.peach, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  iconeT: { fontSize: 28 },
  titulo: { color: C.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.6, textAlign: 'center', marginTop: 4 },
  msg: { color: C.mid, fontSize: 15, lineHeight: 21, textAlign: 'center', marginTop: 8, marginBottom: 22 },
  botoes: { flexDirection: 'row', gap: 10 },
  botao: { flex: 1 },
});
