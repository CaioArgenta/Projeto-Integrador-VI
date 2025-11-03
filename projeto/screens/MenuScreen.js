import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native"; // ✅ Import do hook

import FormMovimentacao from "./FormMovimentacao";
import PlanilhaMov from "./PlanilhaMov";
import Configuracoes from "./Configuracoes";

const Drawer = createDrawerNavigator();

function HomeMenu() {
  const navigation = useNavigation(); // ✅ Hook para usar navigation

  const data = [
    { name: "Fixas", value: 1200, color: "#3b82f6" },
    { name: "Variáveis", value: 850, color: "#facc15" },
    { name: "Parceladas", value: 500, color: "#10b981" },
    { name: "Empréstimos", value: 400, color: "#f87171" },
  ];

  const totalExpenses = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>👋 Olá, Lucas</Text>
      <Text style={styles.subtitle}>Bem-vindo ao Grana+</Text>

      {/* Card de saldo total */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo Atual</Text>
        <Text style={styles.cardValue}>R$ 4.250,00</Text>
      </View>

      {/* Card de despesas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Despesas Mensais</Text>
        {data.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={styles.itemLabel}>{item.name}</Text>
            <Text style={styles.itemValue}>R$ {item.value.toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.itemRowTotal}>
          <Text style={styles.itemLabel}>Total</Text>
          <Text style={styles.itemValue}>R$ {totalExpenses.toFixed(2)}</Text>
        </View>
      </View>

      {/* Menu interativo */}
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate("Registrar Movimentação")}
        >
          <Text style={styles.menuText}>Registrar Movimentação</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate("Planilha de Movimentações")}
        >
          <Text style={styles.menuText}>Planilha de Movimentações</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.navigate("Configurações")}
        >
          <Text style={styles.menuText}>Configurações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function MenuScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="Início"
      screenOptions={{
        drawerStyle: styles.drawer,
        drawerActiveTintColor: "#3a6cf4",
        drawerInactiveTintColor: "#fff",
        drawerLabelStyle: styles.drawerLabel,
        headerStyle: styles.header,
        headerTintColor: "#fff",
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Drawer.Screen name="Início" component={HomeMenu} />
      <Drawer.Screen name="Registrar Movimentação" component={FormMovimentacao} />
      <Drawer.Screen name="Planilha de Movimentações" component={PlanilhaMov} />
      <Drawer.Screen name="Configurações" component={Configuracoes} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: "#0e1a2b", 
    width: 240, 
    borderRightColor: "#3a6cf4",
    borderRightWidth: 1,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    backgroundColor: "#13294b",
    borderBottomWidth: 1,
    borderBottomColor: "#3a6cf4",
  },
  headerTitle: {
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#0e1a2b",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  greeting: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#aaa",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#13294b",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3a6cf4",
  },
  cardTitle: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 10,
  },
  cardValue: {
    color: "#3a6cf4",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  itemLabel: {
    color: "#fff",
    flex: 1,
  },
  itemValue: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#3a6cf4",
    paddingTop: 8,
    marginTop: 8,
  },
  menuContainer: {
    marginTop: 10,
  },
  menuButton: {
    backgroundColor: "#3a6cf4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  menuText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
