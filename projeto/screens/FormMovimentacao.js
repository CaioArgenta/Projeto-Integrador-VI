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

export default function FormMovimentacao({ navigation }) {
  const [tipoMovimentacao, setTipoMovimentacao] = useState(null);
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [iconeSelecionado, setIconeSelecionado] = useState("💼");

  // Data automática formatada: dd/mm/yyyy
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();
  const dataHoje = `${dia}/${mes}/${ano}`;

  const icones = ["💵", "💼", "🛒", "⛽", "🎮", "🏠", "📱", "🍔", "💳", "🏥"];

  const handleSalvar = async () => {
    if (!tipoMovimentacao || !valor) {
      Alert.alert("Atenção", "Escolha entrada/saída e informe o valor!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado!");
        return;
      }

      // Salvar no Firestore
      await addDoc(collection(db, "movimentacao"), {
        usuario_id: user.uid,
        tipo_movimentacao: tipoMovimentacao, // entrada ou saída
        valor: Number(valor),
        data: dataHoje,
        descricao: descricao || "",
        icone_selecionado: iconeSelecionado,
        criado_em: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Movimentação registrada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar:", error);
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

      <Text style={styles.titulo}>Entrada / Saída</Text>

      {/* Entrada / Saída */}
      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[
            styles.tipoBotao,
            tipoMovimentacao === "entrada" && styles.tipoSelecionadoEntrada,
          ]}
          onPress={() => setTipoMovimentacao("entrada")}
        >
          <Text style={styles.tipoTexto}>Entrada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tipoBotao,
            tipoMovimentacao === "saida" && styles.tipoSelecionadoSaida,
          ]}
          onPress={() => setTipoMovimentacao("saida")}
        >
          <Text style={styles.tipoTexto}>Saída</Text>
        </TouchableOpacity>
      </View>

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

      {/* Valor */}
      <Text style={styles.label}>Valor (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 120.50"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      {/* Data automática */}
      <Text style={styles.label}>Data</Text>
      <TextInput style={styles.input} value={dataHoje} editable={false} />

      {/* Descrição */}
      <Text style={styles.label}>Descrição (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Ex: Pix enviado, Salário, Conta de luz..."
        placeholderTextColor="#999"
        multiline
        value={descricao}
        onChangeText={setDescricao}
      />

      {/* Botão salvar */}
      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar Movimentação</Text>
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

  // Tipo
  tipoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
  },
  tipoBotao: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: "#1a2942",
  },
  tipoTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },

  tipoSelecionadoEntrada: { backgroundColor: "#2ecc71" },
  tipoSelecionadoSaida: { backgroundColor: "#e74c3c" },

  // Ícones
  label: { color: "#fff", fontSize: 16, marginBottom: 6 },
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

  // Inputs
  input: {
    backgroundColor: "#1a2942",
    borderRadius: 10,
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
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
