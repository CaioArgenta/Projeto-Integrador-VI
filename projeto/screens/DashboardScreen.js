import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import Pie from "react-native-pie";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function DashboardScreen() {
  const navigation = useNavigation();

  const data = [
    { name: "Fixas", value: 1200, color: "#3b82f6" },
    { name: "Parceladas", value: 500, color: "#10b981" },
    { name: "Variáveis", value: 850, color: "#facc15" },
    { name: "Empréstimos", value: 400, color: "#f87171" },
  ];

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  const screenWidth = Dimensions.get("window").width;
  const chartSize = screenWidth * 0.6; // controla o tamanho do círculo

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={{ width: 28 }} /> {/* espaço para centralizar título */}
      </View>

      {/* CARD DO GRÁFICO */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Despesas Mensais</Text>

        <View style={styles.chartContainer}>
          <Pie
            radius={chartSize / 2}
            innerRadius={chartSize / 4}
            sections={data.map((item) => ({
              percentage: (item.value / total) * 100,
              color: item.color,
            }))}
            strokeCap={"butt"}
          />

          {/* LEGENDA MANUAL */}
          <View style={styles.legendContainer}>
            {data.map((item, index) => (
              <TouchableOpacity key={index} style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>
                  {item.value} {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
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
    padding: 20,
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "#3a6cf4",
  },
  chartTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendContainer: {
    marginLeft: 20,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
  },
  legendText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  totalText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
});
