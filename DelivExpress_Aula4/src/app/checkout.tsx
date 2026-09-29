import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { CORES, useCarrinho } from './_layout';

export default function Checkout() {
  const { itens, total, quantidadeTotal } = useCarrinho();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [referencia, setReferencia] = useState('');
  const [pagamento, setPagamento] = useState('');
  const [precisaTroco, setPrecisaTroco] = useState(false);
  const [trocoPara, setTrocoPara] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});

  function validarPedido() {
    const novosErros: Record<string, string> = {};
    if (quantidadeTotal === 0) novosErros.carrinho = 'Seu carrinho está vazio.';
    if (nome.trim() === '') novosErros.nome = 'Informe seu nome.';
    if (telefone.length < 10) novosErros.telefone = 'Telefone inválido.';
    if (cep.length !== 8) novosErros.cep = 'CEP deve ter 8 dígitos.';
    if (endereco.trim() === '') novosErros.endereco = 'Informe o endereço.';
    if (!/^[0-9]+$/.test(numero)) novosErros.numero = 'Número inválido.';
    if (pagamento === '') novosErros.pagamento = 'Escolha a forma de pagamento.';
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const params = {
      nome,
      endereco,
      numero,
      pagamento,
      total: total.toFixed(2),
      itens: JSON.stringify(itens.map((i) => ({ nome: i.nome, quantidade: i.quantidade }))),
    };

    // Mantém o Alert exigido pelo trabalho e já prepara a tela T4.
    Alert.alert('Pedido confirmado!', 'Seu pedido foi finalizado com sucesso.');
    router.replace({ pathname: '/confirmacao', params });
  }

  function somenteNumeros(valor: string, limite?: number) {
    const limpo = valor.replace(/\D/g, '');
    return limite ? limpo.slice(0, limite) : limpo;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.voltar}><Text style={styles.voltarTexto}>‹</Text></TouchableOpacity>
        <Text style={styles.headerTitulo}>Dados de Entrega</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Campo label="Nome" valor={nome} onChange={setNome} erro={erros.nome} placeholder="Maria Silva" />
        <Campo label="Telefone" valor={telefone} onChange={(v) => setTelefone(somenteNumeros(v, 11))} erro={erros.telefone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
        <Campo label="CEP" valor={cep} onChange={(v) => setCep(somenteNumeros(v, 8))} erro={erros.cep} placeholder="00000000" keyboardType="numeric" />
        <Campo label="Endereço" valor={endereco} onChange={setEndereco} erro={erros.endereco} placeholder="Rua das Flores" />
        <View style={styles.duasColunas}>
          <View style={{ flex: 1 }}><Campo label="Número" valor={numero} onChange={(v) => setNumero(somenteNumeros(v))} erro={erros.numero} placeholder="123" keyboardType="numeric" /></View>
          <View style={{ flex: 1 }}><Campo label="Complemento (opcional)" valor={complemento} onChange={setComplemento} placeholder="Apto 12" /></View>
        </View>
        <Campo label="Referência" valor={referencia} onChange={setReferencia} placeholder="Próximo ao mercado" />

        <Text style={styles.label}>Forma de pagamento</Text>
        <View style={[styles.pickerBox, erros.pagamento && styles.inputErro]}>
          <Picker selectedValue={pagamento} onValueChange={setPagamento} style={styles.picker}>
            <Picker.Item label="Escolha uma opção" value="" />
            <Picker.Item label="Cartão" value="Cartão" />
            <Picker.Item label="Pix" value="Pix" />
            <Picker.Item label="Dinheiro" value="Dinheiro" />
          </Picker>
        </View>
        {erros.pagamento && <Text style={styles.erroTexto}>{erros.pagamento}</Text>}

        {pagamento === 'Dinheiro' && (
          <View style={styles.trocoBox}>
            <View style={styles.switchLinha}><Text style={styles.labelSwitch}>Preciso de troco</Text><Switch value={precisaTroco} onValueChange={setPrecisaTroco} trackColor={{ false: '#CDD2DC', true: CORES.sucesso }} thumbColor={CORES.branco} /></View>
            {precisaTroco && <Campo label="Troco para" valor={trocoPara} onChange={(v) => setTrocoPara(v.replace(/[^0-9.,]/g, ''))} placeholder="50,00" keyboardType="numeric" />}
          </View>
        )}

        {erros.carrinho && <Text style={styles.erroCarrinho}>{erros.carrinho}</Text>}
        <TouchableOpacity style={styles.finalizar} onPress={validarPedido}><Text style={styles.finalizarTexto}>Finalizar pedido</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Campo({ label, valor, onChange, erro, placeholder, keyboardType = 'default' }: { label: string; valor: string; onChange: (v: string) => void; erro?: string; placeholder: string; keyboardType?: 'default' | 'numeric' | 'phone-pad' }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={valor} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#9AA1AE" keyboardType={keyboardType} style={[styles.input, erro && styles.inputErro]} />
      {erro && <Text style={styles.erroTexto}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo },
  header: { paddingTop: 54, paddingHorizontal: 16, paddingBottom: 15, backgroundColor: CORES.primaria, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  voltar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  voltarTexto: { color: CORES.branco, fontSize: 38, lineHeight: 40 },
  headerTitulo: { color: CORES.branco, fontSize: 20, fontWeight: '800' },
  conteudo: { padding: 16, paddingBottom: 35 },
  campo: { marginBottom: 11 },
  label: { color: CORES.escura, fontSize: 14, fontWeight: '700', marginBottom: 6 },
  input: { height: 46, backgroundColor: CORES.branco, borderWidth: 1, borderColor: CORES.borda, borderRadius: 8, paddingHorizontal: 12, color: CORES.escura, fontSize: 14 },
  inputErro: { borderColor: CORES.erro },
  erroTexto: { color: CORES.erro, fontSize: 13, marginTop: 4 },
  duasColunas: { flexDirection: 'row', gap: 10 },
  pickerBox: { height: 50, backgroundColor: CORES.branco, borderRadius: 8, borderWidth: 1, borderColor: CORES.borda, overflow: 'hidden' },
  picker: { color: CORES.escura, height: 50 },
  trocoBox: { marginTop: 12, backgroundColor: CORES.branco, borderRadius: 9, padding: 12 },
  switchLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  labelSwitch: { color: CORES.escura, fontSize: 14, fontWeight: '700' },
  erroCarrinho: { color: CORES.erro, fontSize: 14, marginTop: 12, textAlign: 'center' },
  finalizar: { minHeight: 48, backgroundColor: CORES.primaria, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  finalizarTexto: { color: CORES.branco, fontSize: 15, fontWeight: '800' },
});
