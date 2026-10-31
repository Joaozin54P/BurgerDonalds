import React, { useState } from 'react';
import { Text, View, Switch, ActivityIndicator } from 'react-native';
import { Btn, Input, Sheet } from '../ui';
import { Topo, Linha, confirmar, numero } from './AdminUi';
import { C, common } from '../../theme';
import { R } from '../../utils';
import * as admin from '../../services/adminService';
import { useCarregar } from '../../hooks/useCarregar';
import { useToast } from '../../context/ToastContext';

export default function AdicionaisAdmin() {
  const { say } = useToast();
  const { dados, acao } = useCarregar(admin.adicionais.listar);
  const [form, setForm] = useState(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [disponivel, setDisponivel] = useState(true);
  if (!dados) return <ActivityIndicator size="large" color={C.orange} />;

  const abrir = (a = {}) => { setForm(a); setNome(a.nome ?? ''); setPreco(a.preco != null ? String(a.preco) : ''); setDisponivel(a.disponivel ?? true); };
  const salvar = async () => {
    if (!nome.trim()) return say('Informe o nome do adicional');
    if (!(numero(preco) >= 0)) return say('Informe um preço válido');
    if (await acao(() => admin.adicionais.salvar(form.id, { nome: nome.trim(), preco: numero(preco), disponivel }), 'Adicional salvo')) setForm(null);
  };

  return (
    <>
      <Topo titulo="Adicionais" onNovo={() => abrir()} />
      {dados.map((a) => (
        <Linha key={a.id} titulo={a.nome} sub={`+ ${R(a.preco)}${a.disponivel ? '' : ' · ACABOU'}`}
          direita={<Switch value={!!a.disponivel} trackColor={{ false: '#D8D2C2', true: C.green }} thumbColor="#fff" activeThumbColor="#fff"
            onValueChange={(v) => acao(() => admin.adicionais.salvar(a.id, { nome: a.nome, preco: a.preco, disponivel: v }), v ? 'Disponível' : 'Marcado como acabou')} />}
          onEditar={() => abrir(a)}
          onExcluir={() => confirmar(`Excluir "${a.nome}"?`, () => acao(() => admin.adicionais.excluir(a.id), 'Adicional excluído'))} />
      ))}
      {form && (
        <Sheet onClose={() => setForm(null)}>
          <Text style={common.sheetH}>{form.id ? 'Editar adicional' : 'Novo adicional'}</Text>
          <Input placeholder="Nome (ex: Bacon extra)" value={nome} onChangeText={setNome} />
          <Input placeholder="Preço (ex: 4,50)" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" />
          <View style={common.row}><Text style={common.itTxt}>Disponível</Text><Switch value={disponivel} onValueChange={setDisponivel} trackColor={{ false: '#D8D2C2', true: C.green }} thumbColor="#fff" activeThumbColor="#fff" /></View>
          <Btn onPress={salvar} style={{ marginTop: 10 }}>Salvar</Btn>
        </Sheet>
      )}
    </>
  );
}
