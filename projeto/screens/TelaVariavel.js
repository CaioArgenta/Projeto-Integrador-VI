import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";

export default function TabelaDespesasVariavel() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const COL_WIDTH = {
    valor: 160,
    tipo: 130,
    categoria: 200,
    status: 160,
    registro: 200,
    pagamento: 200,
    acoes: 160,
  };

  const TOTAL_WIDTH = Object.values(COL_WIDTH).reduce((s, v) => s + v, 0);

  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  function irParaMesAnterior() {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((a) => a - 1);
    } else {
      setMesAtual((m) => m - 1);
    }
  }

  function irParaProximoMes() {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((a) => a + 1);
    } else {
      setMesAtual((m) => m + 1);
    }
  }

  const mesRefStr = `${String(mesAtual + 1).padStart(2, "0")}/${anoAtual}`;

  useEffect(() => {
    const unsub = carregarDespesasRealtime();
    return () => unsub && unsub();
  }, [mesAtual, anoAtual]);

  function carregarDespesasRealtime() {
    const user = auth.currentUser;
    if (!user) {
      setDados([]);
      setLoading(false);
      return () => {};
    }

    setLoading(true);
    const q = query(
      collection(db, "despesas_mensais"),
      where("usuario_id", "==", user.uid),
      where("mes_ref", "==", mesRefStr),
      where("tipo", "==", "variavel") // ALTERADO PARA VARIÁVEL
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const lista = snapshot.docs.map((docSnap) => {
            const p = docSnap.data();

            let status = "Aberto";
            if (p.status === "pago" || (p.databaixa && String(p.databaixa).trim() !== "")) {
              status = "Pago";
            } else if (p.status === "pendente") {
              status = "Aberto";
            }

            return {
              id: docSnap.id,
              ativo: p.ativo ?? 1,
              valor: typeof p.valor === "number" ? `R$ ${p.valor.toFixed(2)}` : p.valor ?? "-",
              tipo: p.tipo ?? "-",
              categoria: p.categoria ?? "-",
              status,
              registro: p.vencimento ?? "-",
              pagamento: p.databaixa ?? "-",
            };
          });

          lista.sort((a, b) => {
            const da = new Date(a.registro.split("/").reverse().join("-")) || new Date(0);
            const dbb = new Date(b.registro.split("/").reverse().join("-")) || new Date(0);
            return da - dbb;
          });

          setDados(lista);
        } catch (e) {
          console.log("Erro processando snapshot:", e);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.log("onSnapshot error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }

  const dadosFiltrados = dados.filter((item) => item.ativo === 1);

  function corDoStatus(item) {
    if (item.status === "Pago") return "#10b981";
    if (item.status === "Em atraso") return "#f87171";
    return "#3b82f6";
  }

  async function alterarStatus(item) {
    try {
      const ref = doc(db, "despesas_mensais", item.id);

      if (item.status === "Pago") {
        await updateDoc(ref, {
          databaixa: "",
          status: "pendente",
        });
      } else {
        const hoje = new Date();
        await updateDoc(ref, {
          databaixa: `${String(hoje.getDate()).padStart(2, "0")}/${String(
            hoje.getMonth() + 1
          ).padStart(2, "0")}/${hoje.getFullYear()}`,
          status: "pago",
        });
      }
    } catch (error) {
      console.log("Erro alterarStatus:", error);
      Alert.alert("Erro", "Não foi possível alterar o status.");
    }
  }

  async function excluirDespesa(id) {
    try {
      const ref = doc(db, "despesas_mensais", id);
      await setDoc(ref, { ativo: 2 }, { merge: true });
      setDados((prev) => prev.filter((p) => p.id !== id));
      Alert.alert("Sucesso", "Despesa removida da tela.");
    } catch (error) {
      console.log("ERRO AO MARCAR ATIVO=2:", error);
      Alert.alert("Erro", "Não foi possível remover da visualização.");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0e1a2b", paddingTop: 40 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 14 }}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <TouchableOpacity onPress={irParaMesAnterior}>
          <AntDesign name="left" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold", marginHorizontal: 14 }}>
          {String(mesAtual + 1).padStart(2, "0")} / {anoAtual}
        </Text>

        <TouchableOpacity onPress={irParaProximoMes}>
          <AntDesign name="right" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 150 }}>
        <View style={{ minWidth: TOTAL_WIDTH }}>
          <View style={{ flexDirection: "row", backgroundColor: "#13294b", paddingVertical: 10 }}>
            <Text style={[styles.headerCell, { width: COL_WIDTH.valor }]}>Valor</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.tipo }]}>Tipo</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.categoria }]}>Categoria</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.status }]}>Status</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.registro }]}>Vencimento</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.pagamento }]}>Pagamento</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.acoes }]}>Ações</Text>
          </View>

          {loading ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : dadosFiltrados.length === 0 ? (
            <View style={{ padding: 20 }}>
              <Text style={{ color: "#fff" }}>Nenhuma despesa encontrada.</Text>
            </View>
          ) : (
            dadosFiltrados.map((item) => (
              <View key={item.id} style={{ flexDirection: "row", paddingVertical: 12, backgroundColor: "#1b2b4a", marginBottom: 4 }}>
                <Text style={[styles.cell, { width: COL_WIDTH.valor }]}>{item.valor}</Text>
                <Text style={[styles.cell, { width: COL_WIDTH.tipo }]}>{item.tipo}</Text>
                <Text style={[styles.cell, { width: COL_WIDTH.categoria }]}>{item.categoria}</Text>

                <TouchableOpacity onPress={() => alterarStatus(item)} style={{ width: COL_WIDTH.status, alignItems: "center" }}>
                  <Text style={[styles.cell, { color: corDoStatus(item), fontWeight: "bold" }]}>{item.status}</Text>
                </TouchableOpacity>

                <Text style={[styles.cell, { width: COL_WIDTH.registro }]}>{item.registro}</Text>
                <Text style={[styles.cell, { width: COL_WIDTH.pagamento }]}>{item.pagamento}</Text>

                <View style={{ width: COL_WIDTH.acoes, flexDirection: "row", justifyContent: "center" }}>
                  <TouchableOpacity onPress={() => excluirDespesa(item.id)}>
                    <AntDesign name="delete" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = {
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  cell: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
};
