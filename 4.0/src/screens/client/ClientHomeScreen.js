import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function ClientHomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.welcome}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>O que você gostaria de fazer hoje?</Text>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#007bff" }]}
          onPress={() => navigation.navigate("FazerPedido")}
        >
          <Text style={styles.cardTitle}>🛒 Fazer Pedido</Text>
          <Text style={styles.cardText}>
            Veja todos os produtos disponíveis e monte seu pedido.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#28a745" }]}
          onPress={() => navigation.navigate("SolicitarVisita")}
        >
          <Text style={styles.cardTitle}>📅 Solicitar Visita</Text>
          <Text style={styles.cardText}>
            Agende uma visita com seu representante.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#ffc107" }]}
          onPress={() => navigation.navigate("HistoricoCompras")}
        >
          <Text style={styles.cardTitle}>📦 Histórico de Compras</Text>
          <Text style={styles.cardText}>
            Consulte seus pedidos e pagamentos anteriores.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#17a2b8" }]}
          onPress={() => navigation.navigate("ChatRepresentante")}
        >
          <Text style={styles.cardTitle}>💬 Fale com seu Representante</Text>
          <Text style={styles.cardText}>
            Tire dúvidas e fale diretamente com o representante.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  inner: {
    padding: 20,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 15,
    color: "#f1f1f1",
  },
});