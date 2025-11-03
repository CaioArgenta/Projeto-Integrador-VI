import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen() {
  const data = [
    {
      name: "Fixas",
      value: 1000,
      color: "#3b82f6",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Parceladas",
      value: 500,
      color: "#10b981",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Variáveis",
      value: 484,
      color: "#facc15",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Empréstimos",
      value: 484,
      color: "#f87171",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ];

  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const screenWidth = Dimensions.get("window").width;

  return (


    
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Ionicons name="person-circle" size={40} color="#fff" />
          <Text style={styles.userName}>LUCAS GABRIEL</Text>
        </View>
        <Ionicons name="notifications" size={26} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* CARD DO GRÁFICO */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Saídas Mensais</Text>

          {/* GRÁFICO DE PIZZA */}
          <PieChart
            data={data.map((item) => ({
              name: item.name,
              population: item.value,
              color: item.color,
              legendFontColor: "#333",
              legendFontSize: 13,
            }))}
            width={screenWidth * 0.8}
            height={180}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"20"}
            absolute
          />

          {/* TOTAL CENTRAL */}
          <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>

          {/* LISTA DE CATEGORIAS */}
          {data.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.itemLabel}>{item.name}</Text>
              </View>
              <Text style={styles.itemValue}>R$ {item.value.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* BOTÕES */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerText}>Registrar Movimentação</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerText}>Planilha de Movimentações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerText}>Configurações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1a2b",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#13294b",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  scroll: {
    alignItems: "center",
    paddingVertical: 20,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#13294b",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 8,
  },
  itemLabel: {
    color: "#333",
  },
  itemValue: {
    color: "#333",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  footerButton: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 10,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
