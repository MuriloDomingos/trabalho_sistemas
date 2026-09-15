import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { CORES, produtos, useCarrinho } from './_layout';

const dinheiro = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

export default function Cardapio() {
  const { adicionar, quantidadeTotal } = useCarrinho();
  const [busca, setBusca] = useState('');
  const filtrados = useMemo(() => produtos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase())), [busca]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>DelivExpress</Text>
          <Text style={styles.subtitulo}>Seu pedido do seu jeito.</Text>
        </View>
        <TouchableOpacity style={styles.carrinho} onPress={() => router.push('/carrinho')}>
          <Text style={styles.carrinhoTexto}>🛒 {quantidadeTotal}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Cardápio</Text>
        <TextInput value={busca} onChangeText={setBusca} placeholder="🔎 Buscar produto..." placeholderTextColor={CORES.secundaria} style={styles.busca} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
        >
          {filtrados.map((item) => (
            <View style={styles.card} key={item.id}>
              <Image source={{ uri: item.imagem }} style={styles.imagem} />
              <View style={styles.informacoes}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.descricao}>{item.descricao}</Text>
                <View style={styles.linhaPreco}>
                  <Text style={styles.preco}>{dinheiro(item.preco)}</Text>
                  <TouchableOpacity style={styles.botao} onPress={() => adicionar(item)}>
                    <Text style={styles.botaoTexto}>Adicionar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          {filtrados.length === 0 && (
            <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo
  },

  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16, backgroundColor: CORES.primaria, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },

  logo: {
    color: CORES.branco,
    fontSize: 22,
    fontWeight: '800'
  },

  subtitulo: {
    color: CORES.branco,
    fontSize: 14,
    marginTop: 2
  },

  carrinho: {
    minHeight: 44,
    minWidth: 58,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: CORES.sucesso,
    alignItems: 'center',
    justifyContent: 'center'
  },

  carrinhoTexto: {
    color: CORES.branco,
    fontSize: 15,
    fontWeight: '800'
  },

  conteudo: {
    flex: 1,
    paddingHorizontal: 16
  },

  titulo: {
    color: CORES.escura,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 18,
    marginBottom: 10
  },

  busca: {
    height: 46,
    backgroundColor: CORES.branco,
    borderColor: CORES.borda,
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 14,
    color: CORES.escura,
    fontSize: 14
  },

  lista: {
    paddingTop: 14,
    paddingBottom: 24
  },

  card: {
    backgroundColor: CORES.branco,
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CORES.borda
  },

  imagem: {
    width: '100%',
    height: 145
  },

  informacoes: {
    padding: 13
  },

  nome: {
    color: CORES.escura,
    fontSize: 19,
    fontWeight: '800'
  },

  descricao: {
    color: CORES.secundaria,
    fontSize: 14,
    marginTop: 3,
    marginBottom: 10
  },

  linhaPreco: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  preco: {
    color: CORES.sucesso,
    fontSize: 17,
    fontWeight: '800'
  },

  botao: {
    minHeight: 44,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: CORES.sucesso,
    alignItems: 'center',
    justifyContent: 'center'
  },

  botaoTexto: {
    color: CORES.branco,
    fontSize: 14,
    fontWeight: '800'
  },
  
  vazio: {
    color: CORES.secundaria,
    textAlign: 'center',
    marginTop: 30
  },
});
