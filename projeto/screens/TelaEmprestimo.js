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
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";

export default function TelaEmprestimo() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const COL_WIDTH = {
    valor: 160,
    parcela: 130,
    tipo: 200,
    status: 160,
    vencimento: 200,
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

  function parseDateDDMMYYYY(str) {
    if (!str) return null;
    const [dd, mm, yyyy] = String(str).split("/");
    const d = new Date(+yyyy, +mm - 1, +dd);
    return isNaN(d) ? null : d;
  }

  useEffect(() => {
    const unsub = carregarParcelasRealtime();
    return () => unsub && unsub();
  }, []);

  function carregarParcelasRealtime() {
    const user = auth.currentUser;
    if (!user) {
      setDados([]);
      setLoading(false);
      return () => {};
    }

    setLoading(true);

    const q2 = query(
      collection(db, "parcelas_emprestimo"),
      where("usuario_id", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q2,
      async (snapshot) => {
        try {
          const lista = [];

          for (let dParc of snapshot.docs) {
            const p = dParc.data();


            let status = "Aberto";
            const venc = parseDateDDMMYYYY(p.vencimento);
            const hojeLimpo = new Date(new Date().toDateString());

            if (p.status === "pago" || (p.databaixa && p.databaixa.trim() !== ""))
              status = "Pago";
            else if (venc && venc < hojeLimpo)
              status = "Em atraso";

            
            let tipoTexto = "—";
            if (p.tipo === 1) tipoTexto = "Peguei emprestado";
            if (p.tipo === 2) tipoTexto = "Emprestei dinheiro";

            lista.push({
              id: dParc.id,
              ativo: p.ativo ?? 1,
              valor: p.valor_parcela ? `R$ ${p.valor_parcela.toFixed(2)}` : "-",
              parcela: p.numero_parcela ?? "-",
              tipo: tipoTexto,
              status,
              vencimento: p.vencimento ?? "-",
              pagamento: p.databaixa ?? "-",
            });
          }

        
          lista.sort((a, b) => {
            const da = parseDateDDMMYYYY(a.vencimento) ?? new Date(0);
            const dbb = parseDateDDMMYYYY(b.vencimento) ?? new Date(0);
            return da - dbb;
          });

          setDados(lista);
        } catch (err) {
          console.log("Erro ao processar empréstimo:", err);
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


  const dadosFiltrados = dados.filter((item) => {
    if (item.ativo !== 1) return false;
    const d = parseDateDDMMYYYY(item.vencimento);
    return d && d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  });

  function corDoStatus(item) {
    if (item.status === "Pago") return "#10b981";
    if (item.status === "Em atraso") return "#f87171";
    return "#3b82f6";
  }

  async function alterarStatus(item) {
    try {
      const ref = doc(db, "parcelas_emprestimo", item.id);

      if (item.status === "Pago") {
        await updateDoc(ref, { databaixa: "", status: "aberto" });
      } else {
        const hoje = new Date();
        await updateDoc(ref, {
          databaixa: `${String(hoje.getDate()).padStart(2, "0")}/${String(
            hoje.getMonth() + 1
          ).padStart(2, "0")}/${hoje.getFullYear()}`,
          status: "pago",
        });
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível alterar o status.");
    }
  }

  async function excluirParcela(id) {
    try {
      const ref = doc(db, "parcelas_emprestimo", id);
      await updateDoc(ref, { ativo: 2 });

      setDados((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      Alert.alert("Erro", "Não foi possível remover.");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0e1a2b", paddingTop: 40 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 14 }}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <TouchableOpacity onPress={irParaMesAnterior}>
          <AntDesign name="left" size={26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: "bold",
            marginHorizontal: 14,
          }}
        >
          {String(mesAtual + 1).padStart(2, "0")} / {anoAtual}
        </Text>

        <TouchableOpacity onPress={irParaProximoMes}>
          <AntDesign name="right" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {}
      <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 150 }}>
        <View style={{ minWidth: TOTAL_WIDTH }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#13294b",
              paddingVertical: 10,
            }}
          >
            <Text style={[styles.headerCell, { width: COL_WIDTH.valor }]}>Valor</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.parcela }]}>Parcela</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.tipo }]}>Tipo</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.status }]}>Status</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.vencimento }]}>
              Vencimento
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.pagamento }]}>
              Pagamento
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.acoes }]}>Ações</Text>
          </View>

          {loading ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : dadosFiltrados.length === 0 ? (
            <View style={{ padding: 20 }}>
              <Text style={{ color: "#fff" }}>Nenhum registro encontrado.</Text>
            </View>
          ) : (
            dadosFiltrados.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  paddingVertical: 12,
                  backgroundColor: "#1b2b4a",
                  marginBottom: 4,
                }}
              >
                <Text style={[styles.cell, { width: COL_WIDTH.valor }]}>{item.valor}</Text>
                <Text style={[styles.cell, { width: COL_WIDTH.parcela }]}>
                  {item.parcela}
                </Text>
                <Text style={[styles.cell, { width: COL_WIDTH.tipo }]}>{item.tipo}</Text>

                <TouchableOpacity
                  onPress={() => alterarStatus(item)}
                  style={{ width: COL_WIDTH.status, alignItems: "center" }}
                >
                  <Text
                    style={[
                      styles.cell,
                      { color: corDoStatus(item), fontWeight: "bold" },
                    ]}
                  >
                    {item.status}
                  </Text>
                </TouchableOpacity>

                <Text style={[styles.cell, { width: COL_WIDTH.vencimento }]}>
                  {item.vencimento}
                </Text>

                <Text style={[styles.cell, { width: COL_WIDTH.pagamento }]}>
                  {item.pagamento}
                </Text>

                <View
                  style={{
                    width: COL_WIDTH.acoes,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => excluirParcela(item.id)}>
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
