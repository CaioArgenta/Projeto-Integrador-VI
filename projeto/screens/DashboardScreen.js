// DashboardScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const data = [
    { name: "Fixas", value: 1200, color: "#3b82f6" },
    { name: "Parceladas", value: 500, color: "#10b981" },
    { name: "Variáveis", value: 850, color: "#facc15" },
    { name: "Empréstimos", value: 400, color: "#f87171" },
  ];

  const maxChartWidth = 250;
  const chartWidth = Math.min(screenWidth * 0.5, maxChartWidth);
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  const handlePress = (tipo) => {
    console.log("Botão clicado:", tipo);
    setSelectedCategory(tipo);

    if (tipo === "Parceladas") {
      console.log("Navegando para Telaparcelas");
      navigation.navigate("Telaparcelas");
    } else {
      console.log("Navegando para Planilha de Movimentações");
      navigation.navigate("Planilha de Movimentações", { tipo });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
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
        <Text style={styles.chartTitle}>Despesas Mensais</Text>

        <View style={styles.chartColumn}>
          <View style={styles.chartCenter}>
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
          </View>

          {/* Legenda */}
          <View style={styles.legendContainer}>
            {data.map((item, index) => {
              const percent = (item.value / total) * 100;
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
