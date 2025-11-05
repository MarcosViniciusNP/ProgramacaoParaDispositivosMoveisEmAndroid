import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function ClientLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    // Autenticação simulada (depois conectamos com Firebase Auth)
    if (email === "cliente@teste.com" && senha === "123456") {
      Alert.alert("Login realizado com sucesso!");
      navigation.replace("ClientHome"); // tela do cliente (a gente faz depois)
    } else {
      Alert.alert("Erro", "Email ou senha incorretos.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.inner}>
        <Text style={styles.appName}>NOME DO APP</Text>
        <Text style={styles.welcome}>Bem-vindo(a)!</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert("Função ainda não implementada")}
        >
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  inner: {
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#007bff",
    marginBottom: 8,
  },
  welcome: {
    fontSize: 18,
    color: "#333",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotText: {
    color: "#007bff",
    fontSize: 16,
  },

  backButton: {
  position: "absolute",
  top: 50, // pode ajustar conforme o layout
  left: 20,
  zIndex: 10,
  flexDirection: "row",
  alignItems: "center",
},
backText: {
  color: "#007bff",
  fontSize: 18,
  fontWeight: "600",
},
});