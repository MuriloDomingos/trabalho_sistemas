import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { CORES, useCarrinho } from './_layout';

const dinheiro = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

export default function Carrinho() {
  const { itens, alterarQuantidade, subtotal, taxaEntrega, total, quantidadeTotal } = useCarrinho();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.voltar} activeOpacity={0.7}>
          <Text style={styles.voltarTexto}>←</Text>
          <Text style={styles.headerTitulo}>Meu Carrinho</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {itens.length === 0 ? (
          <View style={styles.vazioBox}>
            <Text style={styles.vazioTitulo}>Seu carrinho está vazio</Text>
            <Text style={styles.vazioTexto}>Adicione produtos do cardápio para continuar.</Text>
            <TouchableOpacity
              style={styles.botaoPrincipal}
              onPress={() => router.replace('/')}
              activeOpacity={0.8}
            >
              <Text style={styles.botaoTexto}>Voltar ao cardápio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.lista}>
              {itens.map((item) => (
                <View key={item.id} style={styles.item}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.nome}>{item.nome}</Text>
                    <Text style={styles.preco}>{dinheiro(item.preco)}</Text>
                  </View>

                  <View style={styles.controles}>
                    <TouchableOpacity
                      style={styles.controle}
                      onPress={() => alterarQuantidade(item.id, -1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.controleTexto}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantidade}>{item.quantidade}</Text>
                    <TouchableOpacity
                      style={styles.controle}
                      onPress={() => alterarQuantidade(item.id, 1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.controleTexto}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.resumo}>
              <Linha texto="Subtotal" valor={dinheiro(subtotal)} />
              <Linha texto="Entrega" valor={dinheiro(taxaEntrega)} />
              <Linha texto="TOTAL" valor={dinheiro(total)} destaque />
            </View>

            <TouchableOpacity
              disabled={quantidadeTotal === 0}
              style={[styles.botaoPrincipal, quantidadeTotal === 0 && styles.botaoDesabilitado]}
              onPress={() => router.push('/checkout')}
              activeOpacity={0.8}
            >
              <Text style={styles.botaoTexto}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Linha({
  texto,
  valor,
  destaque = false,
}: {
  texto: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <View style={styles.linha}>
      <Text style={[styles.linhaTexto, destaque && styles.totalTexto]}>{texto}</Text>
      <Text style={[styles.linhaValor, destaque && styles.totalValor]}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  header: {
    height: 82,
    paddingTop: 34,
    paddingHorizontal: 14,
    backgroundColor: CORES.primaria,
    justifyContent: 'center',
  },
  voltar: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  voltarTexto: {
    color: CORES.branco,
    fontSize: 22,
    fontWeight: '700',
    marginRight: 5,
  },
  headerTitulo: {
    color: CORES.branco,
    fontSize: 17,
    fontWeight: '800',
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 18,
  },
  lista: {
    width: '100%',
  },
  item: {
    minHeight: 55,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  nome: {
    color: CORES.escura,
    fontSize: 14,
    fontWeight: '800',
  },
  preco: {
    color: CORES.secundaria,
    fontSize: 12,
    marginTop: 2,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controle: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: CORES.primaria,
    backgroundColor: CORES.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controleTexto: {
    color: CORES.primaria,
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
  },
  quantidade: {
    width: 22,
    textAlign: 'center',
    color: CORES.escura,
    fontSize: 13,
    fontWeight: '700',
  },
  resumo: {
    marginTop: 'auto',
    paddingTop: 20,
    paddingBottom: 4,
  },
  linha: {
    minHeight: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linhaTexto: {
    color: CORES.secundaria,
    fontSize: 13,
  },
  linhaValor: {
    color: CORES.secundaria,
    fontSize: 13,
  },
  totalTexto: {
    color: CORES.escura,
    fontSize: 14,
    fontWeight: '900',
  },
  totalValor: {
    color: CORES.sucesso,
    fontSize: 14,
    fontWeight: '900',
  },
  botaoPrincipal: {
    minHeight: 44,
    backgroundColor: CORES.primaria,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  botaoTexto: {
    color: CORES.branco,
    fontSize: 14,
    fontWeight: '800',
  },
  vazioBox: {
    alignItems: 'center',
    paddingTop: 35,
  },
  vazioTitulo: {
    color: CORES.escura,
    fontSize: 20,
    fontWeight: '800',
  },
  vazioTexto: {
    color: CORES.secundaria,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
});
