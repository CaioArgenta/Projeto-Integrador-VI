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

export default function CompraParcelada({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [conta, setConta] = useState("Nubank");
  const [iconeSelecionado, setIconeSelecionado] = useState("🛒");

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

  // Data automática (apenas exibição, não usada como vencimento fixo)
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();
  const dataHoje = `${dia}/${mes}/${ano}`;

  const icones = ["💳", "🛒", "🎮", "📱", "🏠", "🚗", "💻", "🎁"];

  const handleSalvarCompra = async () => {
    if (!titulo || !valorTotal || !conta) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
      return;
    }

    const parcelasNum = Number(parcelas);

    if (isNaN(parcelasNum) || parcelasNum < 1 || parcelasNum > 24) {
      Alert.alert("Erro", "Parcelas deve estar entre 1 e 24.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      // Salvar a compra principal
      const compraRef = await addDoc(collection(db, "compras"), {
        usuario_id: user.uid,
        titulo,
        valor_total: Number(valorTotal),
        parcelas: parcelasNum,
        conta,
        icone: iconeSelecionado,
        criado_em: serverTimestamp(),
      });

      const valorParcela = Number(valorTotal) / parcelasNum;

      // 2️⃣ Criar parcelas com vencimento correto mês a mês
      let dataBase = new Date();
      let diaCompra = dataBase.getDate();

      for (let i = 1; i <= parcelasNum; i++) {
        let venc = new Date(dataBase);
        venc.setMonth(venc.getMonth() + (i - 1));

        const dd = String(venc.getDate()).padStart(2, "0");
        const mm = String(venc.getMonth() + 1).padStart(2, "0");
        const yyyy = venc.getFullYear();

        await addDoc(collection(db, "parcela_compra"), {
          compra_id: compraRef.id,
          usuario_id: user.uid,
          numero_parcela: i,
          valor_parcela: Number(valorParcela.toFixed(2)),
          vencimento: `${dd}/${mm}/${yyyy}`,
          status: "pendente",
          criado_em: serverTimestamp(),
          databaixa: " ",
          ativo: 1 ,
        });
      }

      Alert.alert("Sucesso", "Compra parcelada registrada!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível registrar a compra.");
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

      <Text style={styles.titulo}>Registrar Compra Parcelada</Text>

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

      <Text style={styles.label}>Título da compra *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: PlayStation 5"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Valor Total (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 5000"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={valorTotal}
        onChangeText={setValorTotal}
      />

      <Text style={styles.label}>Parcelas (1 a 24)</Text>
      <View style={styles.parcelaBox}>
        <TouchableOpacity
          style={styles.parcelaButton}
          onPress={() =>
            setParcelas((p) => {
              let num = Number(p);
              if (num > 1) return String(num - 1);
              return "1";
            })
          }
        >
          <Text style={styles.parcelaButtonText}>-</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.parcelaInput}
          keyboardType="numeric"
          value={String(parcelas)}
          onChangeText={(v) => {
            const cleaned = v.replace(/[^0-9]/g, "");
            setParcelas(cleaned === "" ? "1" : cleaned);
          }}
        />

        <TouchableOpacity
          style={styles.parcelaButton}
          onPress={() =>
            setParcelas((p) => {
              let num = Number(p);
              if (num < 24) return String(num + 1);
              return "24";
            })
          }
        >
          <Text style={styles.parcelaButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Selecione a conta </Text>

      <View style={styles.bancosContainer}>
        {bancos.map((b) => (
          <TouchableOpacity
            key={b}
            style={[
              styles.bancoBotao,
              conta === b && styles.bancoSelecionado,
            ]}
            onPress={() => setConta(b)}
          >
            <Text style={styles.bancoTexto}>{b}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleSalvarCompra}>
        <Text style={styles.textoBotao}>Salvar Compra Parcelada</Text>
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

  parcelaInput: {
    backgroundColor: "#1a2942",
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    width: 70,
    borderRadius: 10,
    marginHorizontal: 15,
    paddingVertical: 5,
  },

  bancosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    justifyContent: "center",
  },

  bancoBotao: {
    backgroundColor: "#1a2942",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin: 5,
  },

  bancoSelecionado: { backgroundColor: "#4CAF50" },

  bancoTexto: { color: "#fff", fontSize: 14 },

  botao: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 25,
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
