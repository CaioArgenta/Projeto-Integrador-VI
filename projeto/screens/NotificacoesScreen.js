import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function NotificacoesScreen() {
  const notificacoes = [
    {
      id: 1,
      titulo: "💡 Dica Financeira",
      mensagem: "Você já revisou suas despesas do mês? Economizar R$50 pode fazer diferença!",
      tipo: "motivacional",
    },
    {
      id: 2,
      titulo: "🛒 Lembrete",
      mensagem: "Sua conta de supermercado vence amanhã. Planeje seu orçamento!",
      tipo: "alerta",
    },
    {
      id: 3,
      titulo: "💰 Recebimento",
      mensagem: "Seu salário foi depositado na conta. Parabéns!",
      tipo: "info",
    },
    {
      id: 4,
      titulo: "📉 Alerta de Gastos",
      mensagem: "Você gastou 80% do limite de despesas variáveis deste mês.",
      tipo: "alerta",
    },
    {
      id: 5,
      titulo: "🎯 Meta",
      mensagem: "Faltam apenas R$200 para alcançar sua meta de economia mensal.",
      tipo: "motivacional",
    },
  ];

  const getBackgroundColor = (tipo) => {
    switch (tipo) {
      case "motivacional":
        return "#10b981"; // verde
      case "alerta":
        return "#f87171"; // vermelho
      case "info":
      default:
        return "#3b82f6"; // azul
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🔔 Notificações</Text>

      {notificacoes.map((notif) => (
        <View
          key={notif.id}
          style={[styles.notifCard, { borderLeftColor: getBackgroundColor(notif.tipo) }]}
        >
          <Text style={styles.notifTitle}>{notif.titulo}</Text>
          <Text style={styles.notifMessage}>{notif.mensagem}</Text>
        </View>
      ))}

      {/* Mensagem motivacional fixa */}
      <View style={[styles.notifCard, { borderLeftColor: "#10b981" }]}>
        <Text style={styles.notifTitle}>💪 Dica do Dia</Text>
        <Text style={styles.notifMessage}>
          Lembre-se: controlar seus gastos hoje garante liberdade financeira amanhã!
        </Text>
      </View>
    </ScrollView>
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#3a6cf4",
    marginBottom: 20,
    textAlign: "center",
  },
  notifCard: {
    backgroundColor: "#13294b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
  },
  notifTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  notifMessage: {
    color: "#ccc",
    fontSize: 14,
  },
});
