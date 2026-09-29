import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CORES, useCarrinho } from './_layout';

const dinheiro = (valor: string) => `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

type ItemConfirmacao = { nome: string; quantidade: number };

export default function Confirmacao() {
  const params = useLocalSearchParams<{
    endereco?: string;
    numero?: string;
    pagamento?: string;
    total?: string;
    itens?: string;
  }>();
  const { limpar } = useCarrinho();

  let itens: ItemConfirmacao[] = [];
  try {
    itens = params.itens ? JSON.parse(params.itens) : [];
  } catch {
    itens = [];
  }

  const numeroPedido = React.useMemo(() => Math.floor(1000 + Math.random() * 9000), []);

  function novoPedido() {
    limpar();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.sucessoIcon}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.titulo}>Pedido confirmado!</Text>
        <Text style={styles.pedido}>Pedido #{numeroPedido}</Text>

        <View style={styles.divisor} />

        <View style={styles.itens}>
          {itens.map((item, index) => (
            <Text key={`${item.nome}-${index}`} style={styles.itemTexto}>
              {item.quantidade}x {item.nome}
            </Text>
          ))}
        </View>

        <View style={styles.divisor} />

        <View style={styles.linhaTotal}>
          <Text style={styles.totalLabel}>Total pago</Text>
          <Text style={styles.total}>{dinheiro(params.total)}</Text>
        </View>

        <View style={styles.informacoes}>
          <Text style={styles.info}>Entrega: {params.endereco || ''}, {params.numero || ''}</Text>
          <Text style={styles.info}>Pagamento: {params.pagamento || ''}</Text>
        </View>

        <TouchableOpacity style={styles.botao} onPress={novoPedido} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Fazer novo pedido</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.branco },
  conteudo: { flexGrow: 1, paddingHorizontal: 14, paddingTop: 28, paddingBottom: 18, alignItems: 'center' },
  sucessoIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: CORES.sucesso, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  check: { color: CORES.branco, fontSize: 29, lineHeight: 32, fontWeight: '900' },
  titulo: { color: CORES.escura, fontSize: 16, fontWeight: '900' },
  pedido: { color: CORES.primaria, fontSize: 11, fontWeight: '700', marginTop: 4 },
  divisor: { width: '100%', height: 1, backgroundColor: '#DDE2EA', marginVertical: 11 },
  itens: { width: '100%', minHeight: 34 },
  itemTexto: { color: CORES.secundaria, fontSize: 11, lineHeight: 18 },
  linhaTotal: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  totalLabel: { color: CORES.escura, fontSize: 12, fontWeight: '900' },
  total: { color: CORES.sucesso, fontSize: 12, fontWeight: '900' },
  informacoes: { width: '100%' },
  info: { color: CORES.secundaria, fontSize: 10, lineHeight: 16 },
  botao: { width: '100%', minHeight: 44, marginTop: 'auto', backgroundColor: CORES.sucesso, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  botaoTexto: { color: CORES.branco, fontSize: 12, fontWeight: '900' },
});
