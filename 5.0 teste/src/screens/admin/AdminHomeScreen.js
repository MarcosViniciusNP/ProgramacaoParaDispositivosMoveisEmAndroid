import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AdminHomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Pedidos")}
      >
        <Text style={styles.buttonText}>📦 Pedidos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Produtos")}
      >
        <Text style={styles.buttonText}>🛒 Produtos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Clientes")}
      >
        <Text style={styles.buttonText}>👥 Clientes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AdminHomeScreen;