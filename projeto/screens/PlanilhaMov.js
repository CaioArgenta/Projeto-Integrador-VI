import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function PlanilhaMov() {
  const entradas = [
    {
      id: 1,
      descricao: "Venda de Produto A",
      valor: 1500,
      data: "2025-11-01",
      origem: "Cliente João",
      status: "Pago",
      destino: "Conta Corrente",
    },
    {
      id: 2,
      descricao: "Serviço de Consultoria",
      valor: 2200,
      data: "2025-11-02",
      origem: "Empresa XPTO",
      status: "A Receber",
      destino: "Investimento",
    },
  ];

  const saidas = [
    {
      id: 1,
      descricao: "Pagamento de Energia",
      valor: 280,
      data: "2025-11-03",
      categoria: "Contas Fixas",
      status: "Pago",
      formaPagamento: "Débito Automático",
    },
    {
      id: 2,
      descricao: "Compra de Equipamento",
      valor: 950,
      data: "2025-11-04",
      categoria: "Investimento",
      status: "Pendente",
      formaPagamento: "Cartão de Crédito",
    },
  ];

  const totalEntradas = useMemo(
    () => entradas.reduce((acc, cur) => acc + cur.valor, 0),
    []
  );
  const totalSaidas = useMemo(
    () => saidas.reduce((acc, cur) => acc + cur.valor, 0),
    []
  );
  const saldo = totalEntradas - totalSaidas;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📊 Planilha de Movimentações</Text>

      {/* ENTRADAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🟢 Entradas</Text>
        {entradas.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.descricao}>{item.descricao}</Text>
              <Text style={[styles.valor, { color: "#10b981" }]}>
                + R$ {item.valor.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.detalhe}>📅 {item.data}</Text>
            <Text style={styles.detalhe}>📥 Origem: {item.origem}</Text>
            <Text style={styles.detalhe}>🎯 Destino: {item.destino}</Text>
            <Text
              style={[
                styles.status,
                item.status === "Pago"
                  ? styles.statusPago
                  : styles.statusPendente,
              ]}
            >
              {item.status}
            </Text>
          </View>
        ))}
        <Text style={styles.totalTexto}>
          Total de Entradas:{" "}
          <Text style={{ color: "#10b981", fontWeight: "bold" }}>
            R$ {totalEntradas.toFixed(2)}
          </Text>
        </Text>
      </View>

      {/* SAÍDAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔴 Saídas</Text>
        {saidas.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.descricao}>{item.descricao}</Text>
              <Text style={[styles.valor, { color: "#ef4444" }]}>
                - R$ {item.valor.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.detalhe}>📅 {item.data}</Text>
            <Text style={styles.detalhe}>📂 Categoria: {item.categoria}</Text>
            <Text style={styles.detalhe}>
              💳 Forma de Pagamento: {item.formaPagamento}
            </Text>
            <Text
              style={[
                styles.status,
                item.status === "Pago"
                  ? styles.statusPago
                  : styles.statusPendente,
              ]}
            >
              {item.status}
            </Text>
          </View>
        ))}
        <Text style={styles.totalTexto}>
          Total de Saídas:{" "}
          <Text style={{ color: "#ef4444", fontWeight: "bold" }}>
            R$ {totalSaidas.toFixed(2)}
          </Text>
        </Text>
      </View>

      {/* SALDO FINAL */}
      <View style={styles.resumoFinal}>
        <Text style={styles.resumoLabel}>💰 Saldo Final</Text>
        <Text
          style={[
            styles.resumoValor,
            { color: saldo >= 0 ? "#10b981" : "#ef4444" },
          ]}
        >
          R$ {saldo.toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1a2b",
    padding: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#3b82f6",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#13294b",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#3a6cf4",
  },
  descricao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  valor: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detalhe: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 3,
  },
  status: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
    fontWeight: "bold",
    fontSize: 12,
  },
  statusPago: {
    backgroundColor: "#10b98133",
    color: "#10b981",
  },
  statusPendente: {
    backgroundColor: "#ef444433",
    color: "#ef4444",
  },
  totalTexto: {
    color: "#fff",
    fontSize: 15,
    marginTop: 4,
    fontWeight: "600",
    textAlign: "right",
  },
  resumoFinal: {
    backgroundColor: "#1f3550",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#3a6cf4",
  },
  resumoLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  resumoValor: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
