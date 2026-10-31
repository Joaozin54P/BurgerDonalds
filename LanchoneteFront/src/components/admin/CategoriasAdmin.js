import React, { useState } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { Btn, Input, Sheet } from '../ui';
import { Topo, Linha, confirmar } from './AdminUi';
import { C, common } from '../../theme';
import * as admin from '../../services/adminService';
import { useCarregar } from '../../hooks/useCarregar';
import { useToast } from '../../context/ToastContext';

export default function CategoriasAdmin() {
  const { say } = useToast();
  const { dados, acao } = useCarregar(admin.categorias.listar);
  const [form, setForm] = useState(null);
  const [nome, setNome] = useState('');
  if (!dados) return <ActivityIndicator size="large" color={C.orange} />;

  const abrir = (c = {}) => { setForm(c); setNome(c.nome ?? ''); };
  const salvar = async () => {
    if (!nome.trim()) return say('Informe o nome da categoria');
    if (await acao(() => admin.categorias.salvar(form.id, { nome: nome.trim() }), 'Categoria salva')) setForm(null);
  };

  return (
    <>
      <Topo titulo="Categorias" onNovo={() => abrir()} />
      {dados.map((c) => (
        <Linha key={c.id} titulo={c.nome} onEditar={() => abrir(c)}
          onExcluir={() => confirmar(`Excluir "${c.nome}"? (só funciona se não tiver produtos)`, () => acao(() => admin.categorias.excluir(c.id), 'Categoria excluída'))} />
      ))}
      {form && (
        <Sheet onClose={() => setForm(null)}>
          <Text style={common.sheetH}>{form.id ? 'Editar categoria' : 'Nova categoria'}</Text>
          <Input placeholder="Nome (ex: Lanches)" value={nome} onChangeText={setNome} />
          <Btn onPress={salvar} style={{ marginTop: 10 }}>Salvar</Btn>
        </Sheet>
      )}
    </>
  );
}
