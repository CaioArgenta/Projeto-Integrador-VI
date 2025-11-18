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
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function RegistrarEmprestimo({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("peguei"); // peguei | emprestei
  const [valorTotal, setValorTotal] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [conta, setConta] = useState("");
  const [observacao, setObservacao] = useState("");
  const [iconeSelecionado, setIconeSelecionado] = useState("💸");

  const hoje = new Date();
  const dataHoje = hoje.toLocaleDateString("pt-BR");

  const icones = ["💸", "🏦", "🤝", "📄", "💰", "🧾", "📌"];

  const handleSalvarEmprestimo = async () => {
    if (!titulo || !valorTotal || !conta) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      // 1️⃣ Salvar empréstimo principal
      const emprestimoRef = await addDoc(collection(db, "emprestimos"), {
        usuario_id: user.uid,
        titulo,
        tipo, // peguei | emprestei
        valor_total: Number(valorTotal),
        parcelas,
        conta,
        icone: iconeSelecionado,
        observacao,
        data_registro: dataHoje,
        criado_em: serverTimestamp(),
      });

      const valorParcela = Number(valorTotal) / parcelas;

      // 2️⃣ Criar parcelas individuais
      for (let i = 1; i <= parcelas; i++) {
        await addDoc(collection(db, "parcelas_emprestimo"), {
          emprestimo_id: emprestimoRef.id,
          usuario_id: user.uid,
          numero_parcela: i,
          valor_parcela: Number(valorParcela.toFixed(2)),
          vencimento: dataHoje,
          status: "pendente", // pagarei | irão me pagar
          tipo, // mantém o tipo aqui também
          criado_em: serverTimestamp(),
        });
      }

      Alert.alert("Sucesso", "Empréstimo registrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível registrar o empréstimo.");
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

      <Text style={styles.titulo}>Registrar Empréstimo</Text>

      {/* Ícones */}
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

      {/* Título */}
      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Empréstimo Nubank / Dinheiro emprestado ao João"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* Tipo */}
      <Text style={styles.label}>Tipo *</Text>
      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[styles.tipoBotao, tipo === "peguei" && styles.tipoSelecionado]}
          onPress={() => setTipo("peguei")}
        >
          <Text style={styles.tipoTexto}>Peguei emprestado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tipoBotao,
            tipo === "emprestei" && styles.tipoSelecionado,
          ]}
          onPress={() => setTipo("emprestei")}
        >
          <Text style={styles.tipoTexto}>Emprestei dinheiro</Text>
        </TouchableOpacity>
      </View>

      {/* Valor total */}
      <Text style={styles.label}>Valor Total (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1200"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={valorTotal}
        onChangeText={setValorTotal}
      />

      {/* Parcelas */}
      <Text style={styles.label}>Parcelas (1 a 60)</Text>
      <View style={styles.parcelaBox}>
        <TouchableOpacity
          style={styles.parcelaButton}
          onPress={() => setParcelas((prev) => (prev > 1 ? prev - 1 : prev))}
        >
          <Text style={styles.parcelaButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.parcelaNumero}>{parcelas}</Text>

        <TouchableOpacity
          style={styles.parcelaButton}
          onPress={() => setParcelas((prev) => (prev < 60 ? prev + 1 : prev))}
        >
          <Text style={styles.parcelaButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Conta */}
      <Text style={styles.label}>Conta *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Nubank, Caixa, Carteira"
        placeholderTextColor="#999"
        value={conta}
        onChangeText={setConta}
      />

      {/* Observação */}
      <Text style={styles.label}>Observação (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Ex: Empréstimo para ajudar no aluguel"
        placeholderTextColor="#999"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      {/* Botão */}
      <TouchableOpacity style={styles.botao} onPress={handleSalvarEmprestimo}>
        <Text style={styles.textoBotao}>Salvar Empréstimo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e1a2b", paddingHorizontal: 20 },
  voltarButton: { marginTop: 50, alignSelf: "flex-start" },
  titulo: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },

  label: { color: "#fff", fontSize: 16, marginBottom: 6 },
  input: {
    backgroundColor: "#1a2942",
    borderRadius: 10,
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
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
  iconeTexto: { fontSize: 26 },

  tipoContainer: { flexDirection: "row", justifyContent: "space-between" },
  tipoBotao: {
    flex: 1,
    backgroundColor: "#1a2942",
    margin: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  tipoSelecionado: { backgroundColor: "#4CAF50" },
  tipoTexto: { color: "#fff", fontWeight: "bold" },

  parcelaBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  parcelaButton: {
    backgroundColor: "#1a2942",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  parcelaButtonText: { color: "#fff", fontSize: 25, fontWeight: "bold" },
  parcelaNumero: {
    color: "#fff",
    fontSize: 22,
    marginHorizontal: 20,
    fontWeight: "bold",
  },

  botao: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 25,
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
