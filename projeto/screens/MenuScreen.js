import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import FormMovimentacao from "./FormMovimentacao";
import PlanilhaMov from "./PlanilhaMov";
import Configuracoes from "./Configuracoes";
import NotificacoesScreen from "./NotificacoesScreen";
import DashboardScreen from "./DashboardScreen";

const Drawer = createDrawerNavigator();

function HomeMenu() {
  const navigation = useNavigation();

  const data = [
    { name: "Fixas", value: 1200, color: "#3b82f6" },
    { name: "Variáveis", value: 850, color: "#facc15" },
    { name: "Parceladas", value: 500, color: "#10b981" },
    { name: "Empréstimos", value: 400, color: "#f87171" },
  ];

  const totalExpenses = data.reduce((acc, cur) => acc + cur.value, 0);

  const historico = [
    { id: 1, descricao: "💼 Salário recebido", valor: 3500, tipo: "entrada", data: "01/11/2025" },
    { id: 2, descricao: "🛒 Supermercado", valor: 280, tipo: "saida", data: "02/11/2025" },
    { id: 3, descricao: "⛽ Gasolina", valor: 120, tipo: "saida", data: "03/11/2025" },
    { id: 4, descricao: "🎮 Assinatura Game Pass", valor: 49.9, tipo: "saida", data: "03/11/2025" },
  ];

  const notificacoes = 3;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerTop}>
        <View style={styles.profileSection}>
          <Ionicons name="person-circle-outline" size={48} color="#fff" />
          <View>
            <Text style={styles.greeting}>Olá, Lucas 👋</Text>
            <Text style={styles.subtitle}>Bem-vindo ao Grana+</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={() => navigation.navigate("Notificações")}
        >
          <Ionicons name="notifications-outline" size={40} color="#fff" />
          {notificacoes > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificacoes}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Card de Saldo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo Atual</Text>
        <Text style={styles.cardValue}>R$ 4.250,00</Text>
      </View>

      {/* Card de Despesas Mensais */}
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

        {/* Botão Visualizar Gráfico */}
        <TouchableOpacity
          style={styles.viewChartButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.viewChartText}>Visualizar Gráfico</Text>
        </TouchableOpacity>
      </View>

      {/* Histórico */}
      <View style={styles.historicoContainer}>
        <Text style={styles.historicoTitulo}>📊 Histórico de Movimentações</Text>
        {historico.map((mov) => (
          <View key={mov.id} style={styles.historicoCard}>
            <View style={styles.historicoInfo}>
              <Text style={styles.historicoDesc}>{mov.descricao}</Text>
              <Text style={styles.historicoData}>{mov.data}</Text>
            </View>
            <Text
              style={[
                styles.historicoValor,
                { color: mov.tipo === "entrada" ? "#10b981" : "#f87171" },
              ]}
            >
              {mov.tipo === "entrada" ? "+" : "-"}R$ {mov.valor.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default function MenuScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="Início"
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#0e1a2b",
          width: 240,
          borderRightColor: "#3a6cf4",
          borderRightWidth: 1,
        },
        drawerActiveTintColor: "#3a6cf4",
        drawerInactiveTintColor: "#fff",
        drawerLabelStyle: { fontSize: 16, fontWeight: "bold" },
        headerStyle: {
          backgroundColor: "#13294b",
          borderBottomWidth: 1,
          borderBottomColor: "#3a6cf4",
        },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold", color: "#fff" },
      }}
    >
      <Drawer.Screen name="Início" component={HomeMenu} />
      <Drawer.Screen name="Registrar Movimentação" component={FormMovimentacao} />
      <Drawer.Screen name="Planilha de Movimentações" component={PlanilhaMov} />
      <Drawer.Screen name="Configurações" component={Configuracoes} />
      <Drawer.Screen name="Notificações" component={NotificacoesScreen} />
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1a2b",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  greeting: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
  },
  notificationContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#f87171",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
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
  viewChartButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
  },
  viewChartText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  historicoContainer: {
    backgroundColor: "rgba(19, 41, 75, 0.9)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#3a6cf4",
    marginBottom: 30,
  },
  historicoTitulo: {
    color: "#3a6cf4",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  historicoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1b2b4a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(58, 108, 244, 0.3)",
  },
  historicoInfo: {
    flex: 1,
  },
  historicoDesc: {
    color: "#fff",
    fontWeight: "bold",
  },
  historicoData: {
    color: "#aaa",
    fontSize: 12,
  },
  historicoValor: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
