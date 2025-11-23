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
  const [tipo, setTipo] = useState(1); // 1 = peguei, 2 = emprestei
  const [valorTotal, setValorTotal] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [conta, setConta] = useState("");
  const [observacao, setObservacao] = useState("");
  const [iconeSelecionado, setIconeSelecionado] = useState("💸");

  const hoje = new Date();
  const dataHoje = hoje.toLocaleDateString("pt-BR");

  const icones = ["💸", "🏦", "🤝", "📄", "💰", "🧾", "📌"];

  const bancos = [
    "Nubank",
    "Inter",
    "Itaú",
    "Santander",
    "C6 Bank",
    "Caixa",
    "Bradesco",
    "Banco do Brasil",
  ];

  // 👉 Função para adicionar meses corretamente
  const addMes = (data, meses) => {
    const nova = new Date(data);
    nova.setMonth(nova.getMonth() + meses);

    if (nova.getDate() !== data.getDate()) {
      nova.setDate(0);
    }

    return nova;
  };

  const formatarData = (data) => data.toLocaleDateString("pt-BR");

  const handleSalvarEmprestimo = async () => {
    if (!titulo || !valorTotal || !conta) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      // 🔥 Criar empréstimo
      const emprestimoRef = await addDoc(collection(db, "emprestimos"), {
        usuario_id: user.uid,
        titulo,
        tipo, // 1 = peguei | 2 = emprestei
        valor_total: Number(valorTotal),
        parcelas,
        conta,
        icone: iconeSelecionado,
        observacao,
        ativo: 1,
        data_registro: dataHoje,
        criado_em: serverTimestamp(),
      });

      // 🔥 Criar parcelas
      const valorParcela = Number(valorTotal) / parcelas;

      for (let i = 1; i <= parcelas; i++) {
        const dataVenc = addMes(hoje, i - 1);
        const vencimentoFormatado = formatarData(dataVenc);

        await addDoc(collection(db, "parcelas_emprestimo"), {
          emprestimo_id: emprestimoRef.id,
          usuario_id: user.uid,
          numero_parcela: i,
          valor_parcela: Number(valorParcela.toFixed(2)),
          vencimento: vencimentoFormatado,
          status: "pendente",
          tipo, // 👈 numérico também
          ativo: 1,
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
      {/* BOTÃO VOLTAR */}
      <TouchableOpacity
        style={styles.voltarButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Registrar Empréstimo</Text>

      {/* ÍCONES */}
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

      {/* TÍTULO */}
      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Empréstimo Nubank / Dinheiro emprestado"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* TIPO */}
      <Text style={styles.label}>Tipo *</Text>
      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[styles.tipoBotao, tipo === 1 && styles.tipoSelecionado]}
          onPress={() => setTipo(1)}
        >
          <Text style={styles.tipoTexto}>Peguei emprestado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tipoBotao, tipo === 2 && styles.tipoSelecionado]}
          onPress={() => setTipo(2)}
        >
          <Text style={styles.tipoTexto}>Emprestei dinheiro</Text>
        </TouchableOpacity>
      </View>

      {/* VALOR */}
      <Text style={styles.label}>Valor Total (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1200"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={valorTotal}
        onChangeText={setValorTotal}
      />

      {/* PARCELAS */}
      <Text style={styles.label}>Parcelas (1 a 60)</Text>
      <View style={styles.parcelaBox}>
        <TouchableOpacity
          style={styles.parcelaButton}
          onPress={() => setParcelas((p) => (p > 1 ? p - 1 : p))}
        >
          <Text style={styles.parcelaButtonText}>-</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.parcelaInput}
          keyboardType="numeric"
          value={String(parcelas)}
          onChangeText={(text) => {
            const n = Number(text);
            if (!isNaN(n) && n >= 1 && n <= 60) setParcelas(n);
          }}
        />

        <TouchableOpacity
          style={styles.parcelaButton}
          onPress={() => setParcelas((p) => (p < 60 ? p + 1 : p))}
        >
          <Text style={styles.parcelaButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* BANCOS */}
      <Text style={styles.label}>Conta *</Text>
      <View style={styles.bancoContainer}>
        {bancos.map((banco) => (
          <TouchableOpacity
            key={banco}
            style={[
              styles.bancoBotao,
              conta === banco && styles.bancoSelecionado,
            ]}
            onPress={() => setConta(banco)}
          >
            <Text style={styles.bancoTexto}>{banco}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* OBSERVAÇÃO */}
      <Text style={styles.label}>Observação (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Ex: Empréstimo para aluguel"
        placeholderTextColor="#999"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      {/* BOTÃO SALVAR */}
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

  tipoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

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
  parcelaButtonText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },

  parcelaInput: {
    backgroundColor: "#1a2942",
    color: "#fff",
    width: 60,
    height: 40,
    textAlign: "center",
    marginHorizontal: 10,
    borderRadius: 8,
    fontSize: 18,
  },

  bancoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },

  bancoBotao: {
    backgroundColor: "#1a2942",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin: 5,
  },

  bancoSelecionado: {
    backgroundColor: "#4CAF50",
  },

  bancoTexto: {
    color: "#fff",
    fontSize: 14,
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
