import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
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

  const handlePress = (tipo) => {
    navigation.navigate("Planilha de Movimentações", { tipo });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* CARD DO GRÁFICO */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Despesas Mensais</Text>

        {/* Gráfico centralizado */}
        <View style={styles.chartWrapper}>
          <PieChart
            data={data.map((item) => ({
              name: item.name,
              population: item.value,
              color: item.color,
              legendFontColor: "#fff",
              legendFontSize: 14,
            }))}
            width={screenWidth * 0.85}
            height={220}
            chartConfig={{
              color: () => "#fff",
              labelColor: () => "#fff",
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            absolute
          />
        </View>

        <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
      </View>

      {/* LISTA DE CATEGORIAS CLICÁVEIS */}
      <View style={styles.categoryContainer}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryCard}
            onPress={() => handlePress(item.name)}
            activeOpacity={0.8}
          >
            <View style={styles.categoryLeft}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
            <View style={styles.categoryRight}>
              <Text style={styles.categoryValue}>R$ {item.value.toFixed(2)}</Text>
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
    paddingVertical: 25,
    paddingHorizontal: 10,
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "#3a6cf4",
    marginBottom: 25,
  },
  chartTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },
  totalText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
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
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});
