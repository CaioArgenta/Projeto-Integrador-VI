import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";

export default function TabelaParcelas() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  // larguras
  const COL_WIDTH = {
    valor: 160,
    parcela: 130,
    produto: 260,
    banco: 200,
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
    buscarParcelas();
  }, []);

  async function buscarParcelas() {
    try {
      const user = auth.currentUser;
      if (!user) {
        setDados([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const q = query(
        collection(db, "parcela_compra"),
        where("usuario_id", "==", user.uid)
      );

      const snap = await getDocs(q);
      const lista = [];

      for (let dParc of snap.docs) {
        const p = dParc.data();

        // carrega dados da compra
        let compra = {};
        if (p.compra_id) {
          const ref = doc(db, "compras", p.compra_id);
          const snapCompra = await getDoc(ref);
          compra = snapCompra.exists() ? snapCompra.data() : {};
        }

        // status
        let status = "Aberto";
        const venc = parseDateDDMMYYYY(p.vencimento);
        const hojeLimpo = new Date(new Date().toDateString());

        if (p.databaixa) status = "Pago";
        else if (venc && venc < hojeLimpo) status = "Em atraso";

        lista.push({
          id: dParc.id,
          valor:
            typeof p.valor_parcela === "number"
              ? `R$ ${p.valor_parcela.toFixed(2)}`
              : p.valor_parcela ?? "-",
          parcela: `${p.numero_parcela ?? "-"}/${compra.parcelas ?? "-"}`,
          produto: compra.titulo ?? "-",
          banco: compra.conta ?? "-",
          status,
          vencimento: p.vencimento ?? "-",
          pagamento: p.databaixa ?? "-",
          compra_id: p.compra_id,
        });
      }

      // ordenar por vencimento
      lista.sort((a, b) => {
        const da = parseDateDDMMYYYY(a.vencimento) ?? new Date(0);
        const dbb = parseDateDDMMYYYY(b.vencimento) ?? new Date(0);
        return da - dbb;
      });

      setDados(lista);
    } catch (e) {
      console.log("ERRO AO CARREGAR:", e);
      setDados([]);
    } finally {
      setLoading(false);
    }
  }

  const dadosFiltrados = dados.filter((item) => {
    const d = parseDateDDMMYYYY(item.vencimento);
    return d && d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  });

  function corDoStatus(item) {
    if (item.status === "Pago") return "#10b981";
    if (item.status === "Em atraso") return "#f87171";
    return "#3b82f6";
  }

  // alterar status
  async function alterarStatus(item) {
    try {
      const atual = item.status;
      const ref = doc(db, "parcela_compra", item.id);

      if (atual === "Pago") {
        await updateDoc(ref, { databaixa: "" });
      } else {
        const hoje = new Date();
        await updateDoc(ref, {
          databaixa: `${String(hoje.getDate()).padStart(2, "0")}/${String(
            hoje.getMonth() + 1
          ).padStart(2, "0")}/${hoje.getFullYear()}`,
        });
      }

      buscarParcelas();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar o status.");
    }
  }

  // EXCLUIR
  function confirmarExcluir(item) {
    Alert.alert(
      "Excluir parcela",
      `Deseja excluir a parcela ${item.parcela}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => excluirParcela(item.id),
        },
      ]
    );
  }

  async function excluirParcela(id) {
    try {
      await deleteDoc(doc(db, "parcela_compra", id));

      // CORREÇÃO: recarregar lista
      await buscarParcelas();

      Alert.alert("Sucesso", "Parcela excluída.");
    } catch (error) {
      console.log("ERRO AO EXCLUIR:", error);
      Alert.alert("Erro", "Não foi possível excluir.");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0e1a2b", paddingTop: 40 }}>
      {/* VOLTAR */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 14 }}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* MÊS */}
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

      {/* TABELA */}
      <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 110 }}>
        <View style={{ minWidth: TOTAL_WIDTH }}>
          {/* HEADER */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#13294b",
              paddingVertical: 10,
            }}
          >
            <Text style={[styles.headerCell, { width: COL_WIDTH.valor }]}>Valor</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.parcela }]}>Parcela</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.produto }]}>Produto</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.banco }]}>Banco</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.status }]}>Status</Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.vencimento }]}>
              Vencimento
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.pagamento }]}>
              Pagamento
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.acoes }]}>Ações</Text>
          </View>

          {/* LINHAS */}
          {loading ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : dadosFiltrados.length === 0 ? (
            <View style={{ padding: 20 }}>
              <Text style={{ color: "#fff" }}>Nenhuma parcela encontrada.</Text>
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

                <Text
                  style={[styles.cell, { width: COL_WIDTH.produto }]}
                  numberOfLines={2}
                >
                  {item.produto}
                </Text>

                <Text style={[styles.cell, { width: COL_WIDTH.banco }]}>{item.banco}</Text>

                {/* STATUS CLICK */}
                <TouchableOpacity
                  onPress={() => alterarStatus(item)}
                  style={{ width: COL_WIDTH.status, alignItems: "center" }}
                >
                  <Text style={[styles.cell, { color: corDoStatus(item), fontWeight: "bold" }]}>
                    {item.status}
                  </Text>
                </TouchableOpacity>

                <Text style={[styles.cell, { width: COL_WIDTH.vencimento }]}>
                  {item.vencimento}
                </Text>

                <Text style={[styles.cell, { width: COL_WIDTH.pagamento }]}>
                  {item.pagamento}
                </Text>

                {/* AÇÕES */}
                <View
                  style={{
                    width: COL_WIDTH.acoes,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {/* EDITAR */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("editarparcela", {
                        id: item.id,
                        compra_id: item.compra_id,
                      })
                    }
                  >
                    <Feather name="edit" size={20} color="#fff" />
                  </TouchableOpacity>

                  {/* EXCLUIR */}
                  <TouchableOpacity
                    onPress={() => confirmarExcluir(item)}
                    style={{ marginLeft: 18 }}
                  >
                    <AntDesign name="delete" size={20} color="#fff" />
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
