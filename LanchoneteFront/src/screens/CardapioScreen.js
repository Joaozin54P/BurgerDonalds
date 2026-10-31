import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { Btn, Chip } from '../components/ui';
import ItemSheet from '../components/ItemSheet';
import CartSheet from '../components/CartSheet';
import CartContent from '../components/CartContent';
import { C, common, sombraLeve } from '../theme';
import { R, emoji, emojiProduto, novaChave, tint } from '../utils';
import * as cardapioService from '../services/cardapioService';
import * as pedidoService from '../services/pedidoService';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';
import { useToast } from '../context/ToastContext';
import { useLayout } from '../hooks/useLayout';

const GAP = 16;

export default function CardapioScreen({ onPedidoFeito }) {
  const { user, abrirLogin } = useAuth();
  const { linhas, adicionar, limpar, total, qtd } = useCarrinho();
  const { say } = useToast();
  const { wide, width } = useLayout();
  const [menu, setMenu] = useState(null); // { categorias, produtos, adicionais }
  const [cat, setCat] = useState(null);
  const [err, setErr] = useState(null);
  const [sheet, setSheet] = useState(null); // { t: 'item', p } | { t: 'cart' }
  const [larguraGrade, setLarguraGrade] = useState(0);

  // Idempotency-Key do pedido: nasce no primeiro "Fazer pedido" e é REUSADA nas retentativas
  // (duplo clique, rede caindo). Se o carrinho mudar, vale um pedido novo => chave nova.
  const chave = useRef(null);
  useEffect(() => { chave.current = null; }, [linhas]);

  const carregar = useCallback(async () => {
    setErr(null);
    try {
      const m = await cardapioService.carregar();
      setMenu(m);
      setCat((x) => x ?? m.categorias[0]?.id);
    } catch (x) { setErr(x.message); }
  }, []);
  useEffect(() => { carregar(); }, [carregar]);

  const enviar = async (pagamento, obs) => {
    if (!user) return abrirLogin();
    try {
      if (!chave.current) chave.current = novaChave();
      const o = await pedidoService.criar(chave.current, pagamento, obs, linhas);
      chave.current = null;
      limpar(); setSheet(null); onPedidoFeito();
      say('Pedido feito! Senha ' + o.senhaRetirada);
    } catch (x) { say(x.message); }
  };

  if (err) return (
    <View style={common.empty}>
      <Text style={common.emptyIco}>😕</Text>
      <Text style={common.h2}>Cardápio indisponível</Text>
      <Text style={[common.body, { marginBottom: 10, textAlign: 'center' }]}>{err}</Text>
      <Btn onPress={carregar}>Tentar de novo</Btn>
    </View>
  );
  if (!menu) return <ActivityIndicator size="large" color={C.orange} style={{ marginTop: 60 }} />;

  const categoria = menu.categorias.find((c) => c.id === cat);
  const lista = menu.produtos.filter((p) => p.categoriaId === cat);
  const colunas = width >= 1250 ? 3 : width >= 700 ? 2 : 1;
  const larguraCard = colunas > 1 && larguraGrade ? Math.floor((larguraGrade - GAP * (colunas - 1)) / colunas) : '100%';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[s.pagina, !wide && { paddingBottom: 110 }]} showsVerticalScrollIndicator={false}>
        <View style={s.container}>
          <Hero wide={wide} />

          <View style={wide ? s.colunas : null}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pills}>
                {menu.categorias.map((c) => (
                  <Chip key={c.id} ativo={c.id === cat} onPress={() => setCat(c.id)}
                    label={`${emoji(c.nome) === '🍽️' ? '🍴' : emoji(c.nome)}  ${c.nome}`} />
                ))}
              </ScrollView>

              <View style={[common.row, { marginBottom: 14, marginTop: 4 }]}>
                <Text style={common.h2}>{categoria?.nome}</Text>
                <Text style={common.muted}>{lista.length} {lista.length === 1 ? 'item' : 'itens'}</Text>
              </View>

              <View style={s.grade} onLayout={(e) => setLarguraGrade(e.nativeEvent.layout.width)}>
                {lista.map((p) => (
                  <ProdutoCard key={p.id} p={p} categoria={categoria?.nome} largura={larguraCard} lista={colunas === 1}
                    onPress={() => setSheet({ t: 'item', p })} />
                ))}
              </View>
              {!lista.length && <Text style={[common.muted, { textAlign: 'center', padding: 30 }]}>Nenhum item nesta categoria.</Text>}
            </View>

            {wide && (
              <View style={s.lateral}>
                <View style={[common.card, s.cartaoCarrinho]}><CartContent onSend={enviar} /></View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {!wide && qtd > 0 && (
        <Pressable onPress={() => setSheet({ t: 'cart' })} style={({ pressed }) => [s.barra, pressed && { transform: [{ scale: 0.99 }] }]}>
          <View style={s.barraQtd}><Text style={s.barraQtdT}>{qtd}</Text></View>
          <Text style={s.barraT}>Ver pedido</Text>
          <Text style={s.barraV}>{R(total)}</Text>
        </Pressable>
      )}

      {sheet?.t === 'item' && (
        <ItemSheet produto={sheet.p} categoria={categoria?.nome} adicionais={menu.adicionais.filter((a) => a.disponivel)} onClose={() => setSheet(null)}
          onAdd={(l) => { adicionar(l); setSheet(null); say('Adicionado ao pedido ✔'); }} />
      )}
      {sheet?.t === 'cart' && <CartSheet onSend={enviar} onClose={() => setSheet(null)} />}
    </View>
  );
}

function Hero({ wide }) {
  return (
    <View style={[s.hero, wide && s.heroWide]}>
      <View style={{ flex: 1, zIndex: 2 }}>
        <Text style={s.heroEyebrow}>Feito na chapa, saindo na hora</Text>
        <Text style={[s.heroH, wide && s.heroHWide]}>Fome? Chegou{'\n'}a hora!</Text>
        <Text style={[s.heroP, wide && { fontSize: 16 }]}>Monte o pedido, pegue a senha e retire no balcão.</Text>
        {wide && <View style={s.heroTag}><View style={s.heroDot} /><Text style={s.heroTagT}>Retirada no balcão, sem fila</Text></View>}
      </View>
      <View style={[s.arte, wide && s.arteWide]}>
        <View style={[s.arteCirculo, wide && s.arteCirculoWide]} />
        <Text style={[s.arteEmoji, wide && { fontSize: 120 }]}>🍔</Text>
        <Text style={[s.arteFritas, wide && { fontSize: 52, left: 4, bottom: 24 }]}>🍟</Text>
        <View style={[s.selo, wide && s.seloWide]}><Text style={[s.seloT, wide && { fontSize: 11 }]}>NA{'\n'}CHAPA</Text></View>
      </View>
    </View>
  );
}

function ProdutoCard({ p, categoria, largura, lista, onPress }) {
  const disponivel = p.disponivel;
  const imagem = p.imagemUrl
    ? <Image source={{ uri: p.imagemUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
    : <Text style={{ fontSize: lista ? 40 : 66 }}>{emojiProduto(p.nome, categoria)}</Text>;

  return (
    <Pressable disabled={!disponivel} onPress={onPress}
      style={({ hovered }) => [s.card, sombraLeve, { width: largura }, lista && s.cardLista, !disponivel && { opacity: 0.55 }, hovered && disponivel && s.cardHover]}>
      <View style={[s.foto, { backgroundColor: tint(p.id) }, lista && s.fotoLista]}>
        {imagem}
        {!disponivel && <View style={s.acabou}><Text style={s.acabouT}>Acabou</Text></View>}
      </View>
      <View style={[s.cardCorpo, lista && { flex: 1, padding: 0, paddingVertical: 2 }]}>
        <Text style={s.cardNome} numberOfLines={1}>{p.nome}</Text>
        <Text style={s.cardDesc} numberOfLines={2}>{p.descricao}</Text>
        <View style={[common.row, { marginTop: 'auto', paddingTop: 12 }]}>
          <Text style={common.price}>{R(p.preco)}</Text>
          {disponivel && <View style={s.mais}><Text style={s.maisT}>+</Text></View>}
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  pagina: { paddingHorizontal: 16, paddingBottom: 48, alignItems: 'center' },
  container: { width: '100%', maxWidth: 1240 },
  colunas: { flexDirection: 'row', gap: 28, alignItems: 'flex-start' },
  pills: { gap: 8, paddingBottom: 16, paddingTop: 22 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  lateral: { width: 350, marginTop: 22 },
  cartaoCarrinho: { padding: 22, borderRadius: 24, boxShadow: '0 12px 32px rgba(39,38,31,0.08)', ...(Platform.OS === 'web' ? { position: 'sticky', top: 16, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' } : {}) },

  hero: { marginTop: 18, backgroundColor: C.ink, borderRadius: 26, padding: 24, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', minHeight: 190 },
  heroWide: { padding: 44, minHeight: 280, marginTop: 24, borderRadius: 30 },
  heroEyebrow: { color: C.orange, fontSize: 11, fontWeight: '800', letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 8 },
  heroH: { color: '#FBF8F1', fontSize: 30, fontWeight: '800', letterSpacing: -1, lineHeight: 32 },
  heroHWide: { fontSize: 52, lineHeight: 52, letterSpacing: -2 },
  heroP: { color: '#CFC9B8', fontSize: 14, marginTop: 10, maxWidth: 380, lineHeight: 21 },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 99, paddingVertical: 7, paddingHorizontal: 12 },
  heroDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.orange },
  heroTagT: { color: '#E6E1D2', fontSize: 12.5, fontWeight: '700' },
  arte: { width: 118, height: 118, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
  arteWide: { width: 330, height: 250, marginLeft: 20 },
  arteCirculo: { position: 'absolute', width: 118, height: 118, borderRadius: 59, backgroundColor: C.orange },
  arteCirculoWide: { width: 250, height: 250, borderRadius: 125 },
  arteEmoji: { fontSize: 62 },
  arteFritas: { position: 'absolute', fontSize: 28, left: -6, bottom: 4, transform: [{ rotate: '-14deg' }] },
  selo: { position: 'absolute', right: -6, top: -10, width: 46, height: 46, borderRadius: 23, backgroundColor: '#F8F4EA', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '12deg' }] },
  seloWide: { width: 82, height: 82, borderRadius: 41, right: 0, top: 0 },
  seloT: { color: C.ink, fontWeight: '900', fontSize: 8, textAlign: 'center', lineHeight: 10, letterSpacing: 0.4 },

  card: { backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: C.line, overflow: 'hidden' },
  cardLista: { flexDirection: 'row', gap: 14, padding: 12 },
  cardHover: { borderColor: C.peachLine, boxShadow: '0 12px 28px rgba(39,38,31,0.10)' },
  foto: { height: 150, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  fotoLista: { width: 92, height: 92, borderRadius: 16 },
  cardCorpo: { padding: 16, flex: 1 },
  cardNome: { color: C.ink, fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  cardDesc: { color: C.mute, fontSize: 13, lineHeight: 18, marginTop: 4, minHeight: 36 },
  mais: { width: 36, height: 36, borderRadius: 11, backgroundColor: C.orange, alignItems: 'center', justifyContent: 'center' },
  maisT: { color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 25 },
  acabou: { position: 'absolute', top: 10, left: 10, backgroundColor: C.ink, borderRadius: 99, paddingVertical: 4, paddingHorizontal: 10 },
  acabouT: { color: '#FBF8F1', fontSize: 11, fontWeight: '800' },

  barra: { position: 'absolute', left: 14, right: 14, bottom: 16, backgroundColor: C.ink, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, boxShadow: '0 12px 30px rgba(39,38,31,0.35)' },
  barraQtd: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.orange, alignItems: 'center', justifyContent: 'center' },
  barraQtdT: { color: '#fff', fontWeight: '800', fontSize: 13 },
  barraT: { color: '#FBF8F1', fontWeight: '800', fontSize: 16, flex: 1 },
  barraV: { color: '#FBF8F1', fontWeight: '800', fontSize: 17 },
});
