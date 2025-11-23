// DashboardScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot, getDocs } from "firebase/firestore";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [calculoEmprestimo, setCalculoEmprestimo] = useState(0);
  const [parceladasPendentes, setParceladasPendentes] = useState(0);
    const [calculoFixa, setCalculoFixa] = useState(0);
  const [calculoVariaveis, setVariaveis] = useState(0);


  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);



 // 🔥 🔥 🔥 SOMA FIXA
  useEffect(() => {
    if (!user) return;

    const qFixa = query(
    collection(db, "despesas_mensais"),
    where("usuario_id", "==", user.uid),
    where("tipo", "==", "fixa"),
    where("status", "==", "pendente"),
    where("ativo", "==", 1)   
  );

  const unsubFixa = onSnapshot(qFixa, (snapshot) => {
    let total = 0;
    snapshot.forEach((doc) => {
      total += Number(doc.data().valor || 0);
    });
    setCalculoFixa(total);
  });

  return () => unsubFixa();
}, [user]);


  


 //  SOMA VARIAVEIS 
  useEffect(() => {
    if (!user) return;

    const qVariavel = query(
      collection(db, "despesas_mensais"),
      where("usuario_id", "==", user.uid),
      where("tipo", "==", "variavel"),
      where("status", "==", "pendente"),
      where("ativo", "==", 1)
    );

    const unsubVariavel = onSnapshot(qVariavel, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += Number(doc.data().valor || 0);
      });
      setVariaveis(total);
    });

    return () => unsubVariavel();
  }, [user]);




  // 🔥 SOMA DOS EMPRÉSTIMOS PENDENTES
  useEffect(() => {
    if (!user) return;

    const qEmprestimos = query(
      collection(db, "parcelas_emprestimo"),
      where("usuario_id", "==", user.uid),
      where("status", "==", "pendente"),
      where("ativo", "==", 1)
    );

    const unsubEmprestimo = onSnapshot(qEmprestimos, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += Number(doc.data().valor_parcela || 0);
      });
      setCalculoEmprestimo(total);
    });

    return () => unsubEmprestimo();
  }, [user]);

  // 🔥 SOMA DAS PARCELAS PENDENTES DE COMPRAS
  useEffect(() => {
    if (!user) return;

    const qParcelas = query(
      collection(db, "parcela_compra"),
      where("usuario_id", "==", user.uid),
      where("status", "==", "pendente"),
      where("ativo", "==", 1)
    );

    const unsubParcelas = onSnapshot(qParcelas, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += Number(doc.data().valor_parcela || 0);
      });
      setParceladasPendentes(total);
    });

    return () => unsubParcelas();
  }, [user]);

  // 🔹 SOMA FIXAS E VARIÁVEIS
  useEffect(() => {
    if (!user) return;

    const carregarFixasVariaveis = async () => {
      try {
        const q = query(
          collection(db, "movimentacao"),
          where("usuario_id", "==", user.uid)
        );
        const snapshot = await getDocs(q);

        let fixasTotal = 0;
        let variaveisTotal = 0;

        snapshot.forEach((doc) => {
          const mov = doc.data();
          if (mov.tipo_movimentacao !== "saida") return;

          const cat = mov.categoria.toLowerCase();
          if (cat === "fixa") fixasTotal += Number(mov.valor || 0);
          if (cat === "variavel" || cat === "variáveis") variaveisTotal += Number(mov.valor || 0);
        });

        setFixas(fixasTotal);
        setVariaveis(variaveisTotal);
      } catch (error) {
        console.error("Erro ao carregar fixas/variáveis:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarFixasVariaveis();
  }, [user]);

  // 🔹 Atualiza dados do gráfico
  useEffect(() => {
    const categorias = [
      { name: "Fixas", value: calculoFixa, color: "#3b82f6" },
      { name: "Parceladas", value: parceladasPendentes, color: "#10b981" },
      { name: "Variáveis", value: calculoVariaveis, color: "#facc15" },
      { name: "Empréstimos", value: calculoEmprestimo, color: "#f87171" },
    ];
    setData(categorias);
  }, [calculoFixa, calculoVariaveis, parceladasPendentes, calculoEmprestimo]);

  const maxChartWidth = 250;
  const chartWidth = Math.min(screenWidth * 0.5, maxChartWidth);
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  const handlePress = (tipo) => {
    setSelectedCategory(tipo);

    if (tipo === "Parceladas") {
      navigation.navigate("Telaparcelas");
    } else if (tipo === "Empréstimos") {
      navigation.navigate("TelaEmprestimo");
    } else if (tipo === "Fixas") {
      navigation.navigate("TelaFixa");
    } else if (tipo === "Variáveis") {
      navigation.navigate("TelaVariavel");
    } else  {
      navigation.navigate("RegistrarMovimentacao", { tipo });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Gráfico */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Categorias</Text>

        <View style={styles.chartColumn}>
          <View style={styles.chartCenter}>
            {total > 0 ? (
              <PieChart
                data={data.map((item) => ({
                  name: item.name,
                  population: item.value,
                  color: item.color,
                  legendFontColor: "#fff",
                  legendFontSize: 12,
                }))}
                width={chartWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "transparent",
                  backgroundGradientFrom: "#13294b",
                  backgroundGradientTo: "#13294b",
                  color: () => "#fff",
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                hasLegend={false}
                paddingLeft={"0"}
                center={[chartWidth / 8, 0]}
              />
            ) : (
              <Text style={{ color: "#fff" }}>Sem dados para exibir</Text>
            )}
          </View>

          {/* Legenda */}
          <View style={styles.legendContainer}>
            {data.map((item, index) => {
              const percent = total ? (item.value / total) * 100 : 0;
              return (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[styles.colorDot, { backgroundColor: item.color }]}
                  />
                  <Text style={styles.legendText}>
                    {item.name} — R$ {item.value.toFixed(2)} ({percent.toFixed(1)}%)
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
      </View>

      {/* Categorias */}
      <View style={styles.categoryContainer}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryCard,
              selectedCategory === item.name && styles.categoryCardSelected,
            ]}
            onPress={() => handlePress(item.name)}
            activeOpacity={0.8}
          >
            <View style={styles.categoryLeft}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
            <View style={styles.categoryRight}>
              <Text style={styles.categoryValue}>
                R$ {item.value.toFixed(2)}
              </Text>
              <Ionicons name="chevron-forward-outline" size={22} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// estilos inalterados
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0e1a2b",
    alignItems: "center",
    paddingVertical: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  chartCard: {
    backgroundColor: "#13294b",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "90%",
    borderWidth: 1,
    borderColor: "#3a6cf4",
    marginBottom: 25,
    overflow: "visible",
  },
  chartTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartColumn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  chartCenter: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  legendContainer: {
    flex: 1,
    paddingHorizontal: 6,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: "#fff",
    fontSize: 14,
  },
  totalText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  categoryContainer: {
    width: "90%",
    gap: 10,
  },
  categoryCard: {
    backgroundColor: "#13294b",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a6cf4",
  },
  categoryCardSelected: {
    borderColor: "#10b981",
    borderWidth: 2,
    backgroundColor: "#1b3a5a",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryValue: {
    color: "#3b82f6",
    fontWeight: "bold",
    fontSize: 16,
  },
});
