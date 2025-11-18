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
  const [parcelas, setParcelas] = useState(1);
  const [conta, setConta] = useState("");
  const [iconeSelecionado, setIconeSelecionado] = useState("🛒");

  // Data automática
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

    try {
      const user = auth.currentUser;
      if (!user) return;

      // 1️⃣ Salvar a compra principal
      const compraRef = await addDoc(collection(db, "compras"), {
        usuario_id: user.uid,
        titulo,
        valor_total: Number(valorTotal),
        parcelas,
        conta,
        icone: iconeSelecionado,
        criado_em: serverTimestamp(),
      });

      const valorParcela = Number(valorTotal) / parcelas;

      // 2️⃣ Criar as parcelas da compra
      for (let i = 1; i <= parcelas; i++) {
        await addDoc(collection(db, "parcelas_compra"), {
          compra_id: compraRef.id,
          usuario_id: user.uid,
          numero_parcela: i,
          valor_parcela: Number(valorParcela.toFixed(2)),
          vencimento: dataHoje,
          status: "pendente",
          criado_em: serverTimestamp(),
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
      <Text style={styles.label}>Título da compra *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: PlayStation 5"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* Valor total */}
      <Text style={styles.label}>Valor Total (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 5000"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={valorTotal}
        onChangeText={setValorTotal}
      />

      {/* Parcelas */}
      <Text style={styles.label}>Parcelas (1 a 24)</Text>
      <View style={styles.parcelaBox}>
        <TouchableOpacity
          style={styles.parcelaButton}
          onPress={() =>
            setParcelas((prev) => (prev > 1 ? prev - 1 : prev))
          }
        >
          <Text style={styles.parcelaButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.parcelaNumero}>{parcelas}</Text>

        <TouchableOpacity
          style={styles.parcelaButton}
          onPress={() =>
            setParcelas((prev) => (prev < 24 ? prev + 1 : prev))
          }
        >
          <Text style={styles.parcelaButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Conta */}
      <Text style={styles.label}>Conta *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Nubank"
        placeholderTextColor="#999"
        value={conta}
        onChangeText={setConta}
      />

      {/* Botão */}
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

  // Ícones
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

  // Parcelas
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

  // Botão
  botao: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 25,
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
