import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Btn } from '../ui';
import { pedirConfirmacao } from '../ConfirmDialog';
import { C, common, sombraLeve } from '../../theme';

// confirmação no estilo do app (ConfirmDialog.js), igual no navegador e no celular
export const confirmar = (msg, onOk) => pedirConfirmacao({ msg, onOk });

export const numero = (t) => Number(String(t).replace(',', '.'));

export const Topo = ({ titulo, onNovo }) => (
  <View style={[common.row, { marginBottom: 14 }]}>
    <Text style={common.h2}>{titulo}</Text>
    <Btn small onPress={onNovo}>+ Novo</Btn>
  </View>
);

// linha de lista com ações de editar/excluir; `direita` é o que aparece ao lado (ex: Switch)
export const Linha = ({ titulo, sub, direita, onEditar, onExcluir }) => (
  <View style={[s.linha, sombraLeve]}>
    <View style={{ flex: 1 }}>
      <Text style={common.h3}>{titulo}</Text>
      {!!sub && <Text style={s.sub}>{sub}</Text>}
    </View>
    {direita}
    <Btn small kind="light" onPress={onEditar} style={s.acao}>Editar</Btn>
    <Btn small kind="danger" onPress={onExcluir} style={s.acao}>Excluir</Btn>
  </View>
);

const s = StyleSheet.create({
  linha: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: C.line, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  sub: { fontSize: 13, color: C.mute, marginTop: 2 },
  acao: { paddingHorizontal: 12 },
});
