import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    // Login simulado (admin@admin.com e senha 123456)
    if (email === 'admin@admin.com' && senha === '123456') {
      Alert.alert('Login realizado com sucesso!');
      navigation.replace('AdminHome'); // Redireciona pra tela do ADM (iremos criar depois)
    } else {
      Alert.alert('Erro', 'Email ou senha incorretos.');
    }
  };

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Área Administrativa</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert('Função ainda não implementada')}>
        <Text style={styles.forgotText}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotText: {
    textAlign: 'center',
    color: '#007bff',
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