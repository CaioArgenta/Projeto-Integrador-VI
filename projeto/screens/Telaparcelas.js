import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function TabelaParcelas() {
  const [modalVisible, setModalVisible] = useState(false);
  const [valorInput, setValorInput] = useState("");

  const COL_WIDTH = {
    valor: 160,
    parcela: 130,
    produto: 260,
    banco: 200,
    status: 160,
    vencimento: 200,
    pagamento: 200,
    acoes: 150,
  };

  const dadosOriginais = [
    {
      id: 1,
      valor: "R$ 1.200,00",
      parcela: "2/6",
      produto: "Notebook Dell",
      banco: "Nubank",
      status: "Pago",
      vencimento: "12/11/2025",
      pagamento: "11/11/2025",
    },
    {
      id: 2,
      valor: "R$ 300,00",
      parcela: "1/3",
      produto: "Mouse Gamer",
      banco: "Santander",
      status: "Aberto",
      vencimento: "05/12/2025",
      pagamento: "-",
    },
    // pode adicionar mais exemplos aqui
  ];

  // estado local (poderíamos migrar pra useState se for editável)
  const [dados, setDados] = useState(dadosOriginais);

  const navigation = useNavigation();

  // ----------------------------
  // MÊS / ANO SELETOR E FILTRO
  // ----------------------------
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth()); // 0-11
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  function irParaMesAnterior() {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((a) => a - 1);
    } else {
      setMesAtual((m) => m - 1);
    }
  }
  function irParaProximoMes() {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((a) => a + 1);
    } else {
      setMesAtual((m) => m + 1);
    }
  }

  // Converte "dd/mm/yyyy" para Date (meia-noite local)
  function parseDateDDMMYYYY(str) {
    if (!str) return null;
    const parts = String(str).split("/");
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (isNaN(d.getTime())) return null;
    return d;
  }

  // filtra pela data de vencimento (mês/ano selecionado)
  const dadosFiltrados = dados.filter((item) => {
    const d = parseDateDDMMYYYY(item.vencimento);
    if (!d) return false;
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  });

  // ----------------------------
  // LÓGICA DE CORES DO STATUS
  // ----------------------------
  function corDoStatus(item) {
    const statusNormalized = String(item.status ?? "").trim().toLowerCase();
    if (statusNormalized === "pago") return "#10b981"; // verde
    // se não pago, checar vencimento (se vencimento < hoje => atrasado)
    const venc = parseDateDDMMYYYY(item.vencimento);
    if (venc && venc < new Date(new Date().toDateString())) {
      // comparando apenas data (sem hora) — cria Date com toDateString para zerar hora
      return "#f87171"; // vermelho
    }
    return "#3b82f6"; // azul (aberto)
  }

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <View style={{ flex: 1, backgroundColor: "#0e1a2b", paddingTop: 40 }}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ padding: 14 }}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Mês/Ano selector */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <TouchableOpacity onPress={irParaMesAnterior}>
          <AntDesign name="left" size={26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: "bold",
            marginHorizontal: 14,
          }}
        >
          {String(mesAtual + 1).padStart(2, "0")} / {anoAtual}
        </Text>

        <TouchableOpacity onPress={irParaProximoMes}>
          <AntDesign name="right" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabela com scroll horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* HEADER */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#13294b",
              paddingVertical: 10,
            }}
          >
            <Text style={[styles.headerCell, { width: COL_WIDTH.valor }]}>
              Valor
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.parcela }]}>
              Parcela
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.produto }]}>
              Produto
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.banco }]}>
              Banco
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.status }]}>
              Status
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.vencimento }]}>
              Vencimento
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.pagamento }]}>
              Pagamento
            </Text>
            <Text style={[styles.headerCell, { width: COL_WIDTH.acoes }]}>
              Ações
            </Text>
          </View>

          {/* LINHAS (filtradas por mês/ano) */}
          {dadosFiltrados.length === 0 ? (
            <View
              style={{
                padding: 20,
                backgroundColor: "#1b2b4a",
                marginTop: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Nenhuma parcela encontrada neste mês.
              </Text>
            </View>
          ) : (
            dadosFiltrados.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  paddingVertical: 12,
                  backgroundColor: "#1b2b4a",
                  marginBottom: 4,
                }}
              >
                <Text style={[styles.cell, { width: COL_WIDTH.valor }]}>
                  {item.valor}
                </Text>
                <Text style={[styles.cell, { width: COL_WIDTH.parcela }]}>
                  {item.parcela}
                </Text>
                <Text style={[styles.cell, { width: COL_WIDTH.produto }]}>
                  {item.produto}
                </Text>
                <Text style={[styles.cell, { width: COL_WIDTH.banco }]}>
                  {item.banco}
                </Text>

                {/* Status com cor dinâmica */}
                <Text
                  style={[
                    styles.cell,
                    { width: COL_WIDTH.status, color: corDoStatus(item) },
                  ]}
                >
                  {item.status}
                </Text>

                <Text style={[styles.cell, { width: COL_WIDTH.vencimento }]}>
                  {item.vencimento}
                </Text>
                <Text style={[styles.cell, { width: COL_WIDTH.pagamento }]}>
                  {item.pagamento}
                </Text>

                <View
                  style={{
                    width: COL_WIDTH.acoes,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 14,
                  }}
                >
                  <TouchableOpacity>
                    <Feather name="edit" size={22} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <AntDesign name="delete" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating add button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute",
          right: 20,
          bottom: 30,
          backgroundColor: "#007bff",
          padding: 18,
          borderRadius: 40,
        }}
      >
        <AntDesign name="plus" size={26} color="#fff" />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 18,
              }}
            >
              Adicionar Parcela
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Valor"
              placeholderTextColor="#888"
              value={valorInput}
              onChangeText={setValorInput}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: "#007bff",
                padding: 14,
                borderRadius: 8,
                marginTop: 14,
              }}
            >
              <Text
                style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
              >
                Salvar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ padding: 14, marginTop: 10 }}
            >
              <Text style={{ color: "#ccc", textAlign: "center" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  cell: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#13294b",
    width: "85%",
    padding: 20,
    borderRadius: 12,
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
};
