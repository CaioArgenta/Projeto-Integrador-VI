import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function CrialoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" | "success"

  const handleCreateAccount = async () => {
    setMessage("");
    setMessageType("");

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Preencha todos os campos!");
      setMessageType("error");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem!");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      setLoading(false);
      setMessage("Conta criada com sucesso! Agora você pode fazer login.");
      setMessageType("success");

      setTimeout(() => navigation.goBack(), 2000);
    } catch (error) {
      setLoading(false);
      console.log("Erro Firebase:", error.code);

      let msg = "Ocorreu um erro ao criar a conta.";
      if (error.code === "auth/weak-password") {
        msg = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.code === "auth/email-already-in-use") {
        msg = "Esse e-mail já está cadastrado. Tente outro.";
      } else if (error.code === "auth/invalid-email") {
        msg = "E-mail inválido. Digite um e-mail válido.";
      }

      setMessage(msg);
      setMessageType("error");
    }
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
        <Text style={styles.subtitle}>Preencha seus dados para continuar</Text>

        <TextInput
          placeholder="Nome completo"
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
              color="#555"
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

        {/* Mensagem no estilo do login (caixinha colorida) */}
        {message ? (
          <View
            style={[
              styles.messageBox,
              messageType === "error"
                ? styles.errorBox
                : styles.successBox,
            ]}
          >
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAccount}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createText}>Criar Conta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Voltar para Login</Text>
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
    marginTop: 120,
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
  messageBox: {
    width: "100%",
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  messageText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorBox: {
    backgroundColor: "rgba(255, 77, 77, 0.9)",
  },
  successBox: {
    backgroundColor: "rgba(76, 175, 80, 0.9)",
  },
  createButton: {
    backgroundColor: "#3a6cf4",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  createText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#3a6cf4",
    borderRadius: 8,
    paddingVertical: 10,
    width: "100%",
  },
  backText: {
    color: "#3a6cf4",
    textAlign: "center",
    fontWeight: "bold",
  },
});
