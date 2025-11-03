import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground
      source={require("../assets/bg-dark.png")} // opcional: imagem de fundo
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>💰 Grana+</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Entrar na Conta</Text>
        <Text style={styles.subtitle}>
          Gerencie suas finanças de forma simples e segura
        </Text>

        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
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

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createText}>Criar Conta</Text>
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
  loginButton: {
    backgroundColor: "#3a6cf4",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  createButton: {
    borderWidth: 1,
    borderColor: "#3a6cf4",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
  },
  createText: {
    color: "#3a6cf4",
    textAlign: "center",
    fontWeight: "bold",
  },
});
