import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Referência ao campo de senha
  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!email || !password) {
      setErrorMessage("Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigation.navigate("Menu");
    } catch (error) {
      setLoading(false);
      console.log("Erro Firebase:", error.code);

      if (error.code === "auth/user-not-found") {
        setErrorMessage("E-mail não cadastrado!");
      } else if (error.code == "auth/invalid-credential"){
        setErrorMessage("Senha Incorreta! Verifique!");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("E-mail inválido!");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("Muitas tentativas. Tente mais tarde!");
      } else {
        setErrorMessage("Erro ao fazer login. Tente novamente.");
      }
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
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            passwordInputRef.current?.focus();
          }}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordInputRef}
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={handleLogin} // Enter chama login
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

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate("ResetsenhaScreen")}
        >
          <Text style={styles.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* Mensagem de erro acima do botão Entrar */}
        {errorMessage ? (
          <View style={styles.messageBox}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CriarConta")}
        >
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
    marginBottom: 10,
  },
  iconButton: {
    position: "absolute",
    right: 10,
  },
  forgotButton: {
    marginBottom: 15,
    alignSelf: "center",
  },
  forgotText: {
    color: "#3a6cf4",
    fontWeight: "bold",
  },
  messageBox: {
    marginBottom: 10,
    backgroundColor: "rgba(255, 77, 77, 0.9)",
    width: "100%",
    paddingVertical: 8,
    borderRadius: 6,
  },
  errorMessage: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
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
