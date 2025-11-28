import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getFirestore, collection, query, where, onSnapshot, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import DespesaMensal from "./DespesasMensais";
import CompraParcelada from "./CompraParcelada";
import MovEmprest from "./RegistrarEmprestimo";
import FormMovimentacao from "./FormMovimentacao";
import PlanilhaMov from "./PlanilhaMov";
import Configuracoes from "./Configuracoes";
import NotificacoesScreen from "./NotificacoesScreen";
import DashboardScreen from "./DashboardScreen";

const Drawer = createDrawerNavigator();

function HomeMenu() {
  const navigation = useNavigation();
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [usuarioNome, setUsuarioNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [parceladasPendentes, setParceladasPendentes] = useState(0);
  const [calculoEmprestimos, setCalculoEmprestimo] = useState(0);
  const [calculoFixa, setCalculoFixa] = useState(0);
  const [calculoVariaveis, setVariaveis] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  
  async function gerarDespesasDoMesAtual() {
    if (!user) return;

    const hoje = new Date();
    const mesAtual = String(hoje.getMonth() + 1).padStart(2, "0");
    const anoAtual = hoje.getFullYear();
    const mesRefAtual = `${mesAtual}/${anoAtual}`; 

    try {
   
      const q = query(
        collection(db, "despesas_mensais"),
        where("usuario_id", "==", user.uid),
        where("ativo", "==", 1)
      );
      const snapshot = await getDocs(q);
      const despesas = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Filtrar despesas do mês anterior
      const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      const mesRefAnterior = `${String(mesAnterior.getMonth() + 1).padStart(2, "0")}/${mesAnterior.getFullYear()}`;
      const despesasMesAnterior = despesas.filter(d => d.mes_ref === mesRefAnterior);

      // Criar novas despesas para o mês atual, se ainda não existirem
      for (let desp of despesasMesAnterior) {
        const jaExiste = despesas.some(d => d.titulo === desp.titulo && d.mes_ref === mesRefAtual);
        if (!jaExiste) {
          
          const [dia, , ] = desp.vencimento ? desp.vencimento.split("/") : ["01"];
          const vencimentoAtual = `${dia}/${mesAtual}/${anoAtual}`;

          await addDoc(collection(db, "despesas_mensais"), {
            usuario_id: user.uid,
            titulo: desp.titulo,
            tipo: desp.tipo,
            categoria: desp.categoria,
            valor: desp.valor,
            status: "pendente",
            ativo: 1,
            mes_ref: mesRefAtual,
            vencimento: vencimentoAtual,
            criado_em: new Date(),
          });
        }
      }
    } catch (error) {
      console.log("Erro ao gerar despesas do mês atual:", error);
    }
  }

  
  useEffect(() => {
    if (!user) return;

  
    gerarDespesasDoMesAtual();


    const q = query(collection(db, "movimentacao"), where("usuario_id", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = [];
      snapshot.forEach((doc) => lista.push({ id: doc.id, ...doc.data() }));
      setMovimentacoes(lista);
      setLoading(false);
    });


    const unsubUser = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id === user.uid) setUsuarioNome(doc.data().nome || "Usuário");
      });
    });


    const qNotif = query(
      collection(db, "notificacoes"),
      where("usuario_id", "==", user.uid),
      where("lido", "==", false)
    );
    const unsubNotif = onSnapshot(qNotif, (snapshot) => {
      setNotificacoesNaoLidas(snapshot.size);
    });

    return () => {
      unsubscribe();
      unsubUser();
      unsubNotif();
    };
  }, [user]);


 //  SOMA VARIAVEIS 
  useEffect(() => {
    if (!user) return;

    const qVariavel = query(
      collection(db, "despesas_mensais"),
      where("usuario_id", "==", user.uid),
      where("tipo", "==", "variavel"),
      where("status", "==", "pendente"),
      where("ativo", "==", 1)
    );

    const unsubVariavel = onSnapshot(qVariavel, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += Number(doc.data().valor || 0);
      });
      setVariaveis(total);
    });

    return () => unsubVariavel();
  }, [user]);












  // Soma despesas fixas
  useEffect(() => {
    if (!user) return;

    const qFixa = query(
      collection(db, "despesas_mensais"),
      where("usuario_id", "==", user.uid),
      where("tipo", "==", "fixa"),
      where("status", "==", "pendente"),
      where("ativo", "==", 1)
    );

    const unsubFixa = onSnapshot(qFixa, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += Number(doc.data().valor || 0);
      });
      setCalculoFixa(total);
    });

    return () => unsubFixa();
  }, [user]);

  //  Soma empréstimos
  useEffect(() => {
    if (!user) return;

    const qEmprestimos = query(
      collection(db, "parcelas_emprestimo"),
      where("usuario_id", "==", user.uid),
      where("status", "==", "pendente"),
      where("ativo", "==", 1)
    );

    const unsubEmprestimo = onSnapshot(qEmprestimos, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += Number(doc.data().valor_parcela || 0);
      });
      setCalculoEmprestimo(total);
    });

    return () => unsubEmprestimo();
  }, [user]);

  // Soma parcelas pendentes
  useEffect(() => {
    if (!user) return;

    const qParcelas = query(
      collection(db, "parcela_compra"),
      where("usuario_id", "==", user.uid),
      where("status", "==", "pendente"),
      where("ativo", "==", 1)
    );

    const unsubParcelas = onSnapshot(qParcelas, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += Number(doc.data().valor_parcela || 0);
      });
      setParceladasPendentes(total);
    });

    return () => unsubParcelas();
  }, [user]);


  useEffect(() => {
    if (notificacoesNaoLidas > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.4, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [notificacoesNaoLidas]);

  // Calcula saldo
  const entradas = movimentacoes.filter((m) => m.tipo_movimentacao === "entrada");
  const saidas = movimentacoes.filter((m) => m.tipo_movimentacao === "saida");
  const saldo = entradas.reduce((acc, item) => acc + Number(item.valor), 0) -
                saidas.reduce((acc, item) => acc + Number(item.valor), 0);

  //  Totais
  const totais = [
    { name: "Fixas", value: calculoFixa, color: "#3b82f6" },
    { name: "Variáveis", value: calculoVariaveis, color:  "#facc15" },
    { name: "Parceladas", value: parceladasPendentes, color: "#10b981" },
    { name: "Empréstimos", value: calculoEmprestimos, color: "#f87171" },
  ];
  const totalDespesas = totais.reduce((acc, t) => acc + t.value, 0);

  const historicoOrdenado = [...movimentacoes].sort(
    (a, b) => b.criado_em?.seconds - a.criado_em?.seconds
  );
  const historicoLimitado = historicoOrdenado.slice(0, 5);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#3a6cf4" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {}
      <View style={styles.headerTop}>
        <View style={styles.profileSection}>
          <Ionicons name="person-circle-outline" size={48} color="#fff" />
          <View>
            <Text style={styles.greeting}>Olá, {usuarioNome || "Usuário"} </Text>
            <Text style={styles.subtitle}>Bem-vindo ao Grana+</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationContainer} onPress={() => navigation.navigate("Notificações")}>
          <Ionicons name="notifications-outline" size={40} color="#fff" />
          {notificacoesNaoLidas > 0 && (
            <Animated.View style={[styles.notificationBadge, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.notificationCount}>{notificacoesNaoLidas > 9 ? "9+" : notificacoesNaoLidas}</Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo Atual</Text>
        <Text style={styles.cardValue}>R$ {saldo.toFixed(2)}</Text>
      </View>

      {}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Categorias</Text>
        {totais.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={styles.itemLabel}>{item.name}</Text>
            <Text style={styles.itemValue}>R$ {item.value.toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.itemRowTotal}>
          <Text style={styles.itemLabel}>Total</Text>
          <Text style={styles.itemValue}>R$ {totalDespesas.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.viewChartButton} onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.viewChartText}>Visualizar Gráfico</Text>
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.historicoContainer}>
        <Text style={styles.historicoTitulo}>📊 Histórico de Movimentações</Text>
        {historicoLimitado.length === 0 ? (
          <Text style={{ color: "#aaa", textAlign: "center" }}>Nenhuma movimentação encontrada.</Text>
        ) : (
          historicoLimitado.map((mov) => (
            <View key={mov.id} style={styles.historicoCard}>
              <View style={styles.historicoInfo}>
                <Text style={styles.historicoDesc}>{mov.icone_selecionado || "💰"} {mov.descricao}</Text>
                <Text style={styles.historicoData}>{mov.data}</Text>
              </View>
              <Text style={[styles.historicoValor, { color: mov.tipo_movimentacao === "entrada" ? "#10b981" : "#f87171" }]}>
                {mov.tipo_movimentacao === "entrada" ? "+" : "-"}R$ {Number(mov.valor).toFixed(2)}
              </Text>
            </View>
          ))
        )}
        {historicoOrdenado.length > 5 && (
          <TouchableOpacity style={styles.verMaisButton} onPress={() => navigation.navigate("Planilha de Movimentações")}>
            <Text style={styles.verMaisText}>Ver todas as movimentações</Text>
          </TouchableOpacity>
        )}
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
        headerStyle: { backgroundColor: "#13294b", borderBottomWidth: 1, borderBottomColor: "#3a6cf4" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold", color: "#fff" },
      }}
    >
      <Drawer.Screen name="Início" component={HomeMenu} />
      <Drawer.Screen name="Registrar Despesas" component={DespesaMensal} />
      <Drawer.Screen name="Registrar Movimentação" component={FormMovimentacao} />
      <Drawer.Screen name="Registrar Compras" component={CompraParcelada} />
      <Drawer.Screen name="Registrar Empréstimos" component={MovEmprest} />
      <Drawer.Screen name="Notificações" component={NotificacoesScreen} />

    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e1a2b", paddingHorizontal: 20, paddingTop: 30 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  profileSection: { flexDirection: "row", alignItems: "center", gap: 10 },
  greeting: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  subtitle: { color: "#aaa", fontSize: 14 },
  notificationContainer: { position: "relative" },
  notificationBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  card: {
    backgroundColor: "#13294b",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3a6cf4",
  },
  cardTitle: { color: "#ccc", fontSize: 16, marginBottom: 10 },
  cardValue: { color: "#3a6cf4", fontSize: 28, fontWeight: "bold", marginBottom: 15 },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  itemLabel: { color: "#fff", flex: 1 },
  itemValue: { color: "#fff", fontWeight: "bold" },
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
  viewChartText: { color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 16 },
  historicoContainer: {
    backgroundColor: "rgba(19, 41, 75, 0.9)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#3a6cf4",
    marginBottom: 30,
  },
  historicoTitulo: { color: "#3a6cf4", fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
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
  historicoInfo: { flex: 1 },
  historicoDesc: { color: "#fff", fontWeight: "bold" },
  historicoData: { color: "#aaa", fontSize: 12 },
  historicoValor: { fontWeight: "bold", fontSize: 16 },
  verMaisButton: {
    marginTop: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#3a6cf4",
    alignItems: "center",
  },
  verMaisText: { color: "#fff", fontWeight: "bold" },
});
