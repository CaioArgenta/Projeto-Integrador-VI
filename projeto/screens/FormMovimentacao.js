import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // <-- ajuste o caminho conforme seu projeto

export default function FormMovimentacao({ navigation }) {
  const [tipoMovimentacao, setTipoMovimentacao] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [contaOrigem, setContaOrigem] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [parcelas, setParcelas] = useState("");
  const [iconeSelecionado, setIconeSelecionado] = useState("💼");

  const icones = ["💵", "💼", "🛒", "⛽", "🎮", "🏠", "📱", "🍔", "💳", "🏥"];

  const handleSalvar = async () => {
    if (!tipoMovimentacao || !formaPagamento || !valor || !data || !contaOrigem) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado!");
        return;
      }

      await addDoc(collection(db, "movimentacao"), {
        usuario_id: user.uid,
        tipo_movimentacao: tipoMovimentacao.trim(),
        categoria: categoria,
        parcelas: categoria === "parcelada" ? Number(parcelas) || 0 : 0,
        formas_pagamento: formaPagamento,
        conta_origem: contaOrigem,
        valor: Number(valor),
        data: data,
        vencimento: vencimento,
        descricao: descricao || "",
        icone_selecionado: iconeSelecionado,
        criado_em: serverTimestamp(),
      });

      // 🔹 2. Cria uma notificação associada
await addDoc(collection(db, "notificacoes"), {
  usuario_id: user.uid,
  titulo: "Nova movimentação registrada 💰",
  mensagem: `Você adicionou uma ${tipoMovimentacao.trim()} de R$${valor} na categoria ${categoria}.`,
  tipo: "info",
  lido: false,
  criado_em: serverTimestamp(),
});


      

      Alert.alert("Sucesso", "Movimentação registrada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar movimentação:", error);
      Alert.alert("Erro", "Não foi possível salvar a movimentação.");
    }




  };



  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.voltarButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Registrar Movimentação</Text>

      <View style={styles.form}>
        {/* Ícone */}
        <Text style={styles.label}>Escolha um ícone</Text>
        <View style={styles.iconeContainer}>
          {icones.map((icone) => (
            <TouchableOpacity
              key={icone}
              style={[
                styles.iconeBotao,
                iconeSelecionado === icone && styles.iconeSelecionado,
              ]}
              onPress={() => setIconeSelecionado(icone)}
            >
              <Text style={styles.iconeTexto}>{icone}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tipo de Movimentação */}
        <Text style={styles.label}>Tipo de Movimentação</Text>
        <Picker
          selectedValue={tipoMovimentacao}
          onValueChange={(itemValue) => setTipoMovimentacao(itemValue)}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="Selecione o tipo" value="" color="#999" />
          <Picker.Item label="Entrada" value="entrada" color="#fff" />
          <Picker.Item label="Saída" value="saida" color="#fff" />
          <Picker.Item label="Investimento" value="investimento" color="#fff" />
          <Picker.Item label="Transferência" value="transferencia" color="#fff" />
        </Picker>

        {/* Categoria */}
        <Text style={styles.label}>Categoria</Text>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="Selecione a categoria" value="" color="#999" />
          <Picker.Item label="Fixa" value="fixa" color="#fff" />
          <Picker.Item label="Parcelada" value="parcelada" color="#fff" />
          <Picker.Item label="Variável" value="variavel" color="#fff" />
          <Picker.Item label="Empréstimo" value="emprestimo" color="#fff" />
        </Picker>

        {categoria === "parcelada" && (
          <>
            <Text style={styles.label}>Quantidade de Parcelas</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 12"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={parcelas}
              onChangeText={setParcelas}
            />
          </>
        )}

        {/* Forma de Pagamento */}
        <Text style={styles.label}>Forma de Pagamento</Text>
        <Picker
          selectedValue={formaPagamento}
          onValueChange={(itemValue) => setFormaPagamento(itemValue)}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="Selecione a forma" value="" color="#999" />
          <Picker.Item label="Dinheiro" value="dinheiro" color="#fff" />
          <Picker.Item label="Cartão de Crédito" value="credito" color="#fff" />
          <Picker.Item label="Cartão de Débito" value="debito" color="#fff" />
          <Picker.Item label="PIX" value="pix" color="#fff" />
          <Picker.Item label="Transferência" value="transferencia" color="#fff" />
        </Picker>

        {/* Conta de Origem */}
        <Text style={styles.label}>Conta de Origem</Text>
        <Picker
          selectedValue={contaOrigem}
          onValueChange={(itemValue) => setContaOrigem(itemValue)}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="Selecione a conta" value="" color="#999" />
          <Picker.Item label="Nubank" value="nubank" color="#fff" />
          <Picker.Item label="Santander" value="santander" color="#fff" />
          <Picker.Item label="Caixa" value="caixa" color="#fff" />
          <Picker.Item label="Outros" value="outros" color="#fff" />
        </Picker>

        {/* Valor */}
        <Text style={styles.label}>Valor (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o valor"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />

        {/* Data */}
        <Text style={styles.label}>Data</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#999"
          value={data}
          onChangeText={setData}
        />

        {/* Vencimento */}
        <Text style={styles.label}>Data de Vencimento</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#999"
          value={vencimento}
          onChangeText={setVencimento}
        />

        {/* Descrição */}
        <Text style={styles.label}>Descrição (opcional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Ex: Conta de luz, mensalidade, etc."
          placeholderTextColor="#999"
          multiline
          value={descricao}
          onChangeText={setDescricao}
        />

        <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>Salvar Movimentação</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e1a2b", paddingHorizontal: 20 },
  voltarButton: { marginTop: 50, alignSelf: "flex-start" },
  titulo: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  form: { marginTop: 10 },
  label: { color: "#fff", fontSize: 16, marginBottom: 6 },
  input: {
    backgroundColor: "#1a2942",
    borderRadius: 10,
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: "#1a2942",
    borderRadius: 10,
    marginBottom: 15,
    color: "#fff",
  },
  iconeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },
  iconeBotao: {
    backgroundColor: "#1a2942",
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  iconeSelecionado: { backgroundColor: "#4CAF50" },
  iconeTexto: { fontSize: 24 },
  botao: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 25,
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
