import React, { useState, useEffect } from "react";
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
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("variavel"); 

 
  const categoriasFixas = ["Luz","Água","Internet","Aluguel","Telefone","Gás","Condomínio","Outros"];
  const categoriasVariaveis = ["Gasolina","Mercado","Transporte","Lazer","Outros"];

  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();
  const dataHoje = `${dia}/${mes}/${ano}`;
  const mesAtual = `${mes}/${ano}`;

  const user = auth.currentUser;

  const handleSalvar = async () => {
    if (!titulo || !valor || !categoria) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      if (!user) return;

      
      const docRefDespesa = await addDoc(collection(db, "despesa"), {
        usuario_id: user.uid,
        titulo,
        valor_total: Number(valor),
        categoria,
        tipo,
        status: "pendente",
        ativo: 1,
        criado_em: serverTimestamp(),
      });

      await addDoc(collection(db, "despesas_mensais"), {
        usuario_id: user.uid,
        despesa_id: docRefDespesa.id, 
        titulo,
        valor: Number(valor),
        categoria,
        tipo,
        mes_ref: mesAtual,
        status: "pendente",
        ativo: 1,
        vencimento: dataHoje,
        criado_em: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Despesa registrada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível registrar a despesa.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.voltarButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Registrar Despesa</Text>

      <Text style={styles.label}>Nome da despesa *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Conta de Luz"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Valor (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 150"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      <Text style={styles.label}>Tipo da despesa *</Text>
      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[styles.tipoBotao, tipo === "variavel" && styles.tipoSelecionado]}
          onPress={() => {
            setTipo("variavel");
            setCategoria(""); 
          }}
        >
          <Text style={styles.tipoTexto}>Variável</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tipoBotao, tipo === "fixa" && styles.tipoSelecionado]}
          onPress={() => {
            setTipo("fixa");
            setCategoria("");
          }}
        >
          <Text style={styles.tipoTexto}>Fixa (automática todo mês)</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Categoria *</Text>
      <View style={styles.categoriasContainer}>
        {(tipo === "fixa" ? categoriasFixas : categoriasVariaveis).map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.categoriaBotao, categoria === c && styles.categoriaSelecionada]}
            onPress={() => setCategoria(c)}
          >
            <Text style={styles.categoriaTexto}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar Despesa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e1a2b", paddingHorizontal: 20 },
  voltarButton: { marginTop: 50, alignSelf: "flex-start" },
  titulo: { fontSize: 26, color: "#fff", fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  label: { color: "#fff", fontSize: 16, marginBottom: 6 },
  input: { backgroundColor: "#1a2942", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 10, marginBottom: 15 },
  tipoContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 20 },
  tipoBotao: { backgroundColor: "#1a2942", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, margin: 5 },
  tipoSelecionado: { backgroundColor: "#4CAF50" },
  tipoTexto: { color: "#fff", fontSize: 14 },
  categoriasContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20, justifyContent: "center" },
  categoriaBotao: { backgroundColor: "#1a2942", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, margin: 5 },
  categoriaSelecionada: { backgroundColor: "#4CAF50" },
  categoriaTexto: { color: "#fff", fontSize: 14 },
  botao: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, alignItems: "center", marginVertical: 25 },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
