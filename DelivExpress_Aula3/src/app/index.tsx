import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { CORES, produtos, useCarrinho } from './_layout';

const dinheiro = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

export default function Cardapio() {
  const { adicionar, quantidadeTotal } = useCarrinho();
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(
    () => produtos.filter((p) => p.nome.toLowerCase().includes(busca.trim().toLowerCase())),
    [busca],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>DelivExpress</Text>
        <TouchableOpacity
          style={styles.carrinho}
          onPress={() => router.push('/carrinho')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Abrir carrinho com ${quantidadeTotal} itens`}
        >
          <Text style={styles.carrinhoTexto}>{quantidadeTotal}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.conteudo}>
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="🔎 Buscar produto..."
          placeholderTextColor="#8E97A8"
          style={styles.busca}
          returnKeyType="search"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          keyboardShouldPersistTaps="handled"
        >
          {filtrados.map((item) => (
            <View style={styles.card} key={item.id}>
              <Image source={{ uri: item.imagem }} style={styles.imagem} />

              <View style={styles.informacoes}>
                <Text style={styles.nome} numberOfLines={1}>{item.nome}</Text>
                <Text style={styles.descricao} numberOfLines={1}>{item.descricao}</Text>
                <Text style={styles.preco}>{dinheiro(item.preco)}</Text>
              </View>

              <TouchableOpacity
                style={styles.botao}
                onPress={() => adicionar(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoTexto}>+ Add</Text>
              </TouchableOpacity>
            </View>
          ))}

          {filtrados.length === 0 ? (
            <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
          ) : (
            <Text style={styles.mais}>(...)</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  header: {
    height: 58,
    paddingHorizontal: 12,
    backgroundColor: CORES.primaria,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    color: CORES.branco,
    fontSize: 15,
    fontWeight: '800',
  },
  carrinho: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 7,
    borderRadius: 14,
    backgroundColor: CORES.sucesso,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carrinhoTexto: {
    color: CORES.branco,
    fontSize: 12,
    fontWeight: '900',
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 8,
  },
  busca: {
    height: 34,
    marginTop: 7,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: '#CFD5DF',
    borderRadius: 6,
    backgroundColor: '#F8F9FB',
    color: CORES.escura,
    fontSize: 11,
  },
  lista: {
    paddingTop: 8,
    paddingBottom: 18,
  },
  card: {
    minHeight: 64,
    marginBottom: 7,
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 7,
    backgroundColor: '#F3F5F7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagem: {
    width: 42,
    height: 42,
    borderRadius: 6,
    marginRight: 8,
  },
  informacoes: {
    flex: 1,
    minWidth: 0,
    paddingRight: 5,
  },
  nome: {
    color: CORES.escura,
    fontSize: 12,
    fontWeight: '800',
  },
  descricao: {
    color: CORES.secundaria,
    fontSize: 9,
    marginTop: 1,
  },
  preco: {
    color: CORES.erro,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 1,
  },
  botao: {
    minHeight: 30,
    minWidth: 48,
    paddingHorizontal: 7,
    borderRadius: 15,
    backgroundColor: CORES.sucesso,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    color: CORES.branco,
    fontSize: 10,
    fontWeight: '900',
  },
  mais: {
    color: '#A0A8B6',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  vazio: {
    color: CORES.secundaria,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 25,
  },
});
