import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const parceladasData = [
  {
    id: "1",
    valor: 265,
    produto: "Produto X",
    parcela: "1/12",
    banco: "Banco Itaú",
    pago: true,
    dataVencimento: "2025-10-01",
    dataPagamento: "2025-10-01",
  },
  {
    id: "2",
    valor: 950,
    produto: "Empréstimo",
    parcela: "3/12",
    banco: "NuBank",
    pago: false,
    dataVencimento: "2025-11-01",
    dataPagamento: null,
  },
];

export default function Telaparcelas() {
  const navigation = useNavigation();
  const today = new Date();

  const renderItem = ({ item }) => {
    const vencimento = new Date(item.dataVencimento);
    const statusPago = item.pago;
    const statusAtraso = !statusPago && vencimento < today;

    return (
      <View style={styles.row}>
        <Text style={styles.cell}>R$ {item.valor.toFixed(2)}</Text>
        <Text style={styles.cell}>{item.parcela}</Text>
        <Text style={styles.cell}>{item.produto}</Text>
        <Text style={styles.cell}>{item.banco}</Text>
        <Text
          style={[
            styles.cell,
            statusPago
              ? styles.pago
              : statusAtraso
              ? styles.atraso
              : styles.naoPago,
          ]}
        >
          {statusPago ? "Pago" : statusAtraso ? "Atraso" : "Não pago"}
        </Text>
        <Text style={styles.cell}>
          {item.dataVencimento}
        </Text>
        <Text style={styles.cell}>
          {item.dataPagamento ? item.dataPagamento : "-"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={36} color="#fff" />
          <Text style={styles.userName}>Lucas Gabriel</Text>
        </View>
        <Ionicons name="notifications-outline" size={28} color="#fff" />
      </View>

      <Text style={styles.title}>Parceladas</Text>

      {/* Tabela */}
      <ScrollView horizontal style={{ width: "100%" }}>
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Valor</Text>
            <Text style={styles.headerCell}>Parcela</Text>
            <Text style={styles.headerCell}>Produto</Text>
            <Text style={styles.headerCell}>Banco</Text>
            <Text style={styles.headerCell}>Status</Text>
            <Text style={styles.headerCell}>Vencimento</Text>
            <Text style={styles.headerCell}>Pagamento</Text>
          </View>
          <FlatList
            data={parceladasData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>

      {/* Total */}
      <Text style={styles.total}>
        Total: R$ {parceladasData.reduce((acc, cur) => acc + cur.valor, 0).toFixed(2)}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Registrar Movimentação</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Planilha de Movimentações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Configurações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1a2b",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#13294b",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
    width: 120,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#1b2b4a",
    marginBottom: 2,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  cell: {
    color: "#fff",
    width: 120,
    textAlign: "center",
  },
  pago: {
    color: "#10b981",
    fontWeight: "bold",
  },
  atraso: {
    color: "#f87171",
    fontWeight: "bold",
  },
  naoPago: {
    color: "#facc15",
    fontWeight: "bold",
  },
  total: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 25,
    gap: 5,
  },
  button: {
    flex: 1,
    backgroundColor: "#13294b",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a6cf4",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});
