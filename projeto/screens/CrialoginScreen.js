import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CrialoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCreateAccount = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    // Aqui você chamaria sua API de registro
    Alert.alert("Sucesso", "Conta criada com sucesso!");
    navigation.goBack(); // volta para a tela de login
  };

  return (
    <ImageBackground
      source={require("../assets/dark.jpg")}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>💰 Grana+</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>
          Preencha seus dados para criar sua conta
        </Text>

        <TextInput
          placeholder="Nome"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconButton}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Confirmar Senha"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createText}>Criar Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.createButton,
            { marginTop: 10, backgroundColor: "transparent", borderColor: "#3a6cf4" },
          ]}
        >
          <Text style={[styles.createText, { color: "#3a6cf4" }]}>
            Voltar para Login
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1a2b",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 100,
    backgroundColor: "#13294b",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#3a6cf4",
  },
  logoText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "#3a6cf4",
    borderRadius: 20,
    width: "85%",
    padding: 25,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  iconButton: {
    position: "absolute",
    right: 10,
  },
  createButton: {
    backgroundColor: "#3a6cf4",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  createText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
