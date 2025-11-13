import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function NotificacoesScreen() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // 🔹 Busca as notificações do usuário logado, em ordem decrescente de data
    const q = query(
      collection(db, "notificacoes"),
      where("usuario_id", "==", user.uid),
      orderBy("criado_em", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotificacoes(lista);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getCorPorTipo = (tipo) => {
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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Carregando notificações...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🔔 Notificações</Text>

      {notificacoes.length === 0 ? (
        <Text style={{ color: "#ccc", textAlign: "center", marginTop: 20 }}>
          Nenhuma notificação encontrada.
        </Text>
      ) : (
        notificacoes.map((notif) => (
          <View
            key={notif.id}
            style={[
              styles.notifCard,
              { borderLeftColor: getCorPorTipo(notif.tipo || "info") },
            ]}
          >
            <Text style={styles.notifTitle}>{notif.titulo}</Text>
            <Text style={styles.notifMessage}>{notif.mensagem}</Text>
          </View>
        ))
      )}

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
