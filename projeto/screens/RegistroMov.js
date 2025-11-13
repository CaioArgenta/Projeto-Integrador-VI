import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function RegistroMov() {
  const navigation = useNavigation();
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "movimentacao"), where("usuario_id", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = [];
      snapshot.forEach((doc) => lista.push({ id: doc.id, ...doc.data() }));
      const ordenado = lista.sort((a, b) => b.criado_em?.seconds - a.criado_em?.seconds);
      setMovimentacoes(ordenado);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const entradas = movimentacoes.filter((m) => m.tipo_movimentacao === "entrada");
  const saidas = movimentacoes.filter((m) => m.tipo_movimentacao === "saida");
  const saldo =
    entradas.reduce((acc, item) => acc + Number(item.valor), 0) -
    saidas.reduce((acc, item) => acc + Number(item.valor), 0);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#3a6cf4" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Carregando movimentações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico Completo</Text>
        <View style={{ width: 30 }} /> {/* espaçamento equilibrado */}
      </View>

      {/* Saldo Atual */}
      <View style={styles.cardSaldo}>
        <Text style={styles.saldoLabel}>Saldo Atual</Text>
        <Text
          style={[
            styles.saldoValor,
            { color: saldo >= 0 ? "#10b981" : "#f87171" },
          ]}
        >
          R$ {saldo.toFixed(2)}
        </Text>
      </View>

      {/* Lista de movimentações */}
      {movimentacoes.length === 0 ? (
        <Text style={styles.semMov}>Nenhuma movimentação registrada.</Text>
      ) : (
        <FlatList
          data={movimentacoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardMov}>
              <View style={styles.infoContainer}>
                <Text style={styles.desc}>
                  {item.icone_selecionado || "💰"} {item.descricao}
                </Text>
                <Text style={styles.data}>{item.data}</Text>
              </View>
              <Text
                style={[
                  styles.valor,
                  {
                    color:
                      item.tipo_movimentacao === "entrada"
                        ? "#10b981"
                        : "#f87171",
                  },
                ]}
              >
                {item.tipo_movimentacao === "entrada" ? "+" : "-"}R${" "}
                {Number(item.valor).toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1a2b",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  cardSaldo: {
    backgroundColor: "#13294b",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#3a6cf4",
    marginBottom: 20,
    alignItems: "center",
  },
  saldoLabel: {
    color: "#ccc",
    fontSize: 16,
  },
  saldoValor: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },
  cardMov: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1b2b4a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(58, 108, 244, 0.3)",
  },
  infoContainer: {
    flex: 1,
  },
  desc: {
    color: "#fff",
    fontWeight: "bold",
  },
  data: {
    color: "#aaa",
    fontSize: 12,
  },
  valor: {
    fontWeight: "bold",
    fontSize: 16,
  },
  semMov: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 30,
  },
});
