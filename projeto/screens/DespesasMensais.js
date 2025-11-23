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

export default function DespesasMensais({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("Luz");
  const [conta, setConta] = useState("Nubank");

  const categorias = [
    "Luz",
    "Água",
    "Internet",
    "Aluguel",
    "Telefone",
    "Gás",
    "Condomínio",
    "Outros",
  ];

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

  // Data de hoje
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();
  const dataHoje = `${dia}/${mes}/${ano}`;

  const handleSalvar = async () => {
    if (!titulo || !valor || !categoria || !conta) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      // Salva no Firebase
      await addDoc(collection(db, "despesas_mensais"), {
        usuario_id: user.uid,
        titulo,
        valor: Number(valor),
        categoria,
        conta,
        vencimento: dataHoje,
        criado_em: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Despesa mensal registrada!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível registrar a despesa.");
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

      <Text style={styles.titulo}>Registrar Despesa Mensal</Text>

      {/* Campo Título */}
      <Text style={styles.label}>Nome da despesa *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Conta de Luz"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* Valor */}
      <Text style={styles.label}>Valor (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 150"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      {/* Categoria */}
      <Text style={styles.label}>Categoria *</Text>
      <View style={styles.categoriasContainer}>
        {categorias.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.categoriaBotao,
              categoria === c && styles.categoriaSelecionada,
            ]}
            onPress={() => setCategoria(c)}
          >
            <Text style={styles.categoriaTexto}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bancos */}
      <Text style={styles.label}>Pagar com *</Text>

      <View style={styles.bancosContainer}>
        {bancos.map((b) => (
          <TouchableOpacity
            key={b}
            style={[styles.bancoBotao, conta === b && styles.bancoSelecionado]}
            onPress={() => setConta(b)}
          >
            <Text style={styles.bancoTexto}>{b}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão salvar */}
      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar Despesa</Text>
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

  // Categorias
  categoriasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    justifyContent: "center",
  },

  categoriaBotao: {
    backgroundColor: "#1a2942",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin: 5,
  },

  categoriaSelecionada: { backgroundColor: "#4CAF50" },

  categoriaTexto: { color: "#fff", fontSize: 14 },

  // Bancos
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
