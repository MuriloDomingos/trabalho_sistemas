import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { CORES, useCarrinho } from './_layout';

const dinheiro = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

export default function Carrinho() {
  const { itens, alterarQuantidade, subtotal, taxaEntrega, desconto, total, cupom, setCupom, quantidadeTotal } = useCarrinho();
  const [aplicado, setAplicado] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.voltar}><Text style={styles.voltarTexto}>‹</Text></TouchableOpacity>
        <Text style={styles.headerTitulo}>Meu Carrinho</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>
        {itens.length === 0 ? (
          <View style={styles.vazioBox}>
            <Text style={styles.icone}>🛒</Text>
            <Text style={styles.vazioTitulo}>Seu carrinho está vazio</Text>
            <Text style={styles.vazioTexto}>Adicione produtos do cardápio para continuar.</Text>
            <TouchableOpacity style={styles.botaoPrincipal} onPress={() => router.replace('/')}><Text style={styles.botaoTexto}>Voltar ao cardápio</Text></TouchableOpacity>
          </View>
        ) : (
          <>
            {itens.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.itemInfo}>
                  <Text style={styles.nome}>{item.nome}</Text>
                  <Text style={styles.preco}>{dinheiro(item.preco)}</Text>
                </View>
                <View style={styles.controles}>
                  <TouchableOpacity style={styles.controle} onPress={() => alterarQuantidade(item.id, -1)}><Text style={styles.controleTexto}>−</Text></TouchableOpacity>
                  <Text style={styles.quantidade}>{item.quantidade}</Text>
                  <TouchableOpacity style={styles.controle} onPress={() => alterarQuantidade(item.id, 1)}><Text style={styles.controleTexto}>+</Text></TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.cupomBox}>
              <Text style={styles.label}>Cupom de desconto</Text>
              <View style={styles.cupomLinha}>
                <TextInput value={cupom} onChangeText={(v) => { setCupom(v.toUpperCase()); setAplicado(false); }} placeholder="Digite ALUNO10" style={styles.cupomInput} autoCapitalize="characters" />
                <TouchableOpacity style={styles.cupomBotao} onPress={() => setAplicado(true)}><Text style={styles.cupomBotaoTexto}>Aplicar</Text></TouchableOpacity>
              </View>
              {aplicado && cupom === 'ALUNO10' && <Text style={styles.cupomSucesso}>Cupom aplicado: 10% de desconto.</Text>}
              {aplicado && cupom !== 'ALUNO10' && <Text style={styles.cupomErro}>Cupom inválido.</Text>}
            </View>

            <View style={styles.resumo}>
              <Linha texto="Subtotal" valor={dinheiro(subtotal)} />
              {desconto > 0 && <Linha texto="Desconto" valor={`- ${dinheiro(desconto)}`} />}
              <Linha texto="Entrega" valor={dinheiro(taxaEntrega)} />
              <View style={styles.divisor} />
              <Linha texto="TOTAL" valor={dinheiro(total)} destaque />
            </View>

            <TouchableOpacity disabled={quantidadeTotal === 0} style={styles.botaoPrincipal} onPress={() => router.push('/checkout')}><Text style={styles.botaoTexto}>Continuar</Text></TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Linha({ texto, valor, destaque = false }: { texto: string; valor: string; destaque?: boolean }) {
  return <View style={styles.linha}><Text style={[styles.linhaTexto, destaque && styles.totalTexto]}>{texto}</Text><Text style={[styles.linhaValor, destaque && styles.totalValor]}>{valor}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo },
  header: { paddingTop: 54, paddingHorizontal: 16, paddingBottom: 15, backgroundColor: CORES.primaria, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  voltar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  voltarTexto: { color: CORES.branco, fontSize: 38, lineHeight: 40 },
  headerTitulo: { color: CORES.branco, fontSize: 20, fontWeight: '800' },
  conteudo: { padding: 16, paddingBottom: 30 },
  item: { backgroundColor: CORES.branco, borderRadius: 10, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E1E5EC' },
  itemInfo: { flex: 1 },
  nome: { color: CORES.escura, fontSize: 16, fontWeight: '800' },
  preco: { color: CORES.secundaria, fontSize: 14, marginTop: 3 },
  controles: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  controle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF0F5', alignItems: 'center', justifyContent: 'center' },
  controleTexto: { color: CORES.escura, fontSize: 22, fontWeight: '700' },
  quantidade: { minWidth: 18, textAlign: 'center', color: CORES.escura, fontWeight: '700' },
  cupomBox: { marginTop: 8, backgroundColor: CORES.branco, borderRadius: 10, padding: 14 },
  label: { color: CORES.escura, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  cupomLinha: { flexDirection: 'row', gap: 8 },
  cupomInput: { flex: 1, height: 44, borderWidth: 1, borderColor: CORES.borda, borderRadius: 8, paddingHorizontal: 12, color: CORES.escura },
  cupomBotao: { minHeight: 44, paddingHorizontal: 15, borderRadius: 8, backgroundColor: CORES.primaria, alignItems: 'center', justifyContent: 'center' },
  cupomBotaoTexto: { color: CORES.branco, fontWeight: '800' },
  cupomSucesso: { color: CORES.sucesso, fontSize: 13, marginTop: 7 },
  cupomErro: { color: CORES.erro, fontSize: 13, marginTop: 7 },
  resumo: { backgroundColor: CORES.branco, borderRadius: 10, padding: 16, marginTop: 12 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  linhaTexto: { color: CORES.secundaria, fontSize: 14 },
  linhaValor: { color: CORES.secundaria, fontSize: 14 },
  divisor: { height: 1, backgroundColor: '#E4E7ED', marginVertical: 5 },
  totalTexto: { color: CORES.escura, fontSize: 16, fontWeight: '900' },
  totalValor: { color: CORES.sucesso, fontSize: 17, fontWeight: '900' },
  botaoPrincipal: { minHeight: 48, backgroundColor: CORES.primaria, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  botaoTexto: { color: CORES.branco, fontSize: 15, fontWeight: '800' },
  vazioBox: { backgroundColor: CORES.branco, borderRadius: 12, padding: 28, alignItems: 'center', marginTop: 30 },
  icone: { fontSize: 42 },
  vazioTitulo: { color: CORES.escura, fontSize: 20, fontWeight: '800', marginTop: 10 },
  vazioTexto: { color: CORES.secundaria, fontSize: 14, textAlign: 'center', marginTop: 5 },
});
