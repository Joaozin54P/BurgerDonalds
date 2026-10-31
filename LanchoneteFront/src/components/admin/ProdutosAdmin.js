import React, { useState } from 'react';
import { View, Text, Switch, ActivityIndicator } from 'react-native';
import { Btn, Input, Sheet, Chip } from '../ui';
import { Topo, Linha, confirmar, numero } from './AdminUi';
import { C, common } from '../../theme';
import { R } from '../../utils';
import * as admin from '../../services/adminService';
import { useCarregar } from '../../hooks/useCarregar';
import { useToast } from '../../context/ToastContext';

export default function ProdutosAdmin() {
  const { dados, acao } = useCarregar(() => Promise.all([admin.produtos.listar(), admin.categorias.listar()]));
  const [form, setForm] = useState(null); // {} = novo | produto = editar
  if (!dados) return <ActivityIndicator size="large" color={C.orange} />;
  const [lista, cats] = dados;
  const nomeCat = (id) => cats.find((c) => c.id === id)?.nome ?? '-';

  return (
    <>
      <Topo titulo="Produtos" onNovo={() => setForm({})} />
      {lista.map((p) => (
        <Linha key={p.id} titulo={p.nome} sub={`${nomeCat(p.categoriaId)} · ${R(p.preco)}${p.disponivel ? '' : ' · ACABOU'}`}
          direita={<Switch value={!!p.disponivel} trackColor={{ false: '#D8D2C2', true: C.green }} thumbColor="#fff" activeThumbColor="#fff"
            onValueChange={(v) => acao(() => admin.produtos.disponibilidade(p.id, v), v ? 'Voltou ao cardápio' : 'Marcado como acabou')} />}
          onEditar={() => setForm(p)}
          onExcluir={() => confirmar(`Excluir "${p.nome}"?`, () => acao(() => admin.produtos.excluir(p.id), 'Produto excluído'))} />
      ))}
      {form && <ProdutoForm inicial={form} cats={cats} onClose={() => setForm(null)}
        onSalvar={async (d) => { if (await acao(() => admin.produtos.salvar(form.id, d), 'Produto salvo')) setForm(null); }} />}
    </>
  );
}

function ProdutoForm({ inicial, cats, onSalvar, onClose }) {
  const { say } = useToast();
  const [nome, setNome] = useState(inicial.nome ?? '');
  const [descricao, setDescricao] = useState(inicial.descricao ?? '');
  const [preco, setPreco] = useState(inicial.preco != null ? String(inicial.preco) : '');
  const [imagemUrl, setImagemUrl] = useState(inicial.imagemUrl ?? '');
  const [categoriaId, setCategoriaId] = useState(inicial.categoriaId ?? cats[0]?.id);
  const [disponivel, setDisponivel] = useState(inicial.disponivel ?? true);

  const salvar = () => {
    if (!nome.trim()) return say('Informe o nome do produto');
    if (!(numero(preco) >= 0)) return say('Informe um preço válido');
    if (!categoriaId) return say('Crie uma categoria antes');
    onSalvar({ categoriaId, nome: nome.trim(), descricao: descricao.trim(), preco: numero(preco), imagemUrl: imagemUrl.trim() || null, disponivel });
  };

  return (
    <Sheet onClose={onClose}>
      <Text style={common.sheetH}>{inicial.id ? 'Editar produto' : 'Novo produto'}</Text>
      <Input placeholder="Nome" value={nome} onChangeText={setNome} />
      <Input placeholder="Descrição" value={descricao} onChangeText={setDescricao} multiline />
      <Input placeholder="Preço (ex: 24,90)" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" />
      <Input placeholder="URL da imagem (opcional)" value={imagemUrl} onChangeText={setImagemUrl} autoCapitalize="none" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 }}>
        {cats.map((c) => (
          <Chip key={c.id} label={c.nome} ativo={c.id === categoriaId} onPress={() => setCategoriaId(c.id)} />
        ))}
      </View>
      <View style={common.row}><Text style={common.itTxt}>Disponível no cardápio</Text><Switch value={disponivel} onValueChange={setDisponivel} trackColor={{ false: '#D8D2C2', true: C.green }} thumbColor="#fff" activeThumbColor="#fff" /></View>
      <Btn onPress={salvar} style={{ marginTop: 10 }}>Salvar</Btn>
    </Sheet>
  );
}
