import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CORES, useCarrinho } from './_layout';

const dinheiro = (valor: string) => `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;

export default function Confirmacao() {
  const params = useLocalSearchParams<{ nome: string; endereco: string; numero: string; pagamento: string; total: string; itens: string }>();
  const { limpar } = useCarrinho();
  const itens = params.itens ? JSON.parse(params.itens) as { nome: string; quantidade: number }[] : [];
  const numeroPedido = React.useMemo(() => Math.floor(1000 + Math.random() * 9000), []);

  function novoPedido() {
    limpar();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.sucessoIcon}><Text style={styles.check}>✓</Text></View>
        <Text style={styles.titulo}>Pedido confirmado!</Text>
        <Text style={styles.pedido}>Pedido #{numeroPedido}</Text>

        <View style={styles.card}>
          {itens.map((item) => <View key={item.nome} style={styles.item}><Text style={styles.itemTexto}>{item.quantidade}x {item.nome}</Text></View>)}
          <View style={styles.divisor} />
          <View style={styles.linha}><Text style={styles.totalLabel}>Total pago</Text><Text style={styles.total}>{dinheiro(params.total || '0')}</Text></View>
          <Text style={styles.info}>Entrega: {params.endereco}, {params.numero}</Text>
          <Text style={styles.info}>Pagamento: {params.pagamento}</Text>
        </View>

        <TouchableOpacity style={styles.botao} onPress={novoPedido}><Text style={styles.botaoTexto}>Fazer novo pedido</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo },
  conteudo: { flexGrow: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  sucessoIcon: { width: 74, height: 74, borderRadius: 37, backgroundColor: CORES.sucesso, alignItems: 'center', justifyContent: 'center' },
  check: { color: CORES.branco, fontSize: 46, fontWeight: '800', marginTop: -3 },
  titulo: { color: CORES.escura, fontSize: 23, fontWeight: '900', marginTop: 15 },
  pedido: { color: CORES.primaria, fontSize: 15, fontWeight: '700', marginTop: 4 },
  card: { width: '100%', backgroundColor: CORES.branco, borderRadius: 12, padding: 18, marginTop: 22, borderWidth: 1, borderColor: '#E1E5EC' },
  item: { marginBottom: 7 },
  itemTexto: { color: CORES.secundaria, fontSize: 14 },
  divisor: { height: 1, backgroundColor: '#E4E7ED', marginVertical: 8 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  totalLabel: { color: CORES.escura, fontSize: 16, fontWeight: '900' },
  total: { color: CORES.sucesso, fontSize: 16, fontWeight: '900' },
  info: { color: CORES.secundaria, fontSize: 14, marginTop: 4 },
  botao: { width: '100%', minHeight: 48, backgroundColor: CORES.sucesso, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  botaoTexto: { color: CORES.branco, fontSize: 15, fontWeight: '800' },
});
