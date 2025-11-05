import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TelaPagamento({ route, navigation }) {
  const { cart = [], total = 0 } = route.params || {};
  const [formaPagamento, setFormaPagamento] = useState(null);

  const handleConfirmar = () => {
    if (!formaPagamento) {
      Alert.alert("Atenção", "Selecione uma forma de pagamento.");
      return;
    }

    // Aqui futuramente será enviada para o banco e pro Admin
    Alert.alert(
      "Pedido Confirmado!",
      `Forma de pagamento: ${formaPagamento.toUpperCase()}\n\nTotal: R$ ${total.toFixed(
        2
      )}`,
      [{ text: "OK", onPress: () => navigation.navigate("ClientHome") }]
    );
  };

  const handleCancelar = () => {
    Alert.alert("Cancelar Pedido", "Tem certeza que deseja cancelar?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, cancelar",
        style: "destructive",
        onPress: () => navigation.navigate("ClientHome"),
      },
    ]);
  };

  const renderItem = (item) => (
    <View key={item.id} style={styles.item}>
      <Text style={styles.itemName}>
        {item.name}  x{item.quantity}
      </Text>
      <Text style={styles.itemPrice}>
        R$ {(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Resumo do Pedido</Text>

        {cart.length === 0 ? (
          <Text style={{ color: "#666", textAlign: "center", marginTop: 20 }}>
            Nenhum item no carrinho.
          </Text>
        ) : (
          <>
            {cart.map(renderItem)}
            <View style={styles.totalBox}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
            </View>

            <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[
                  styles.paymentButton,
                  formaPagamento === "cartão" && styles.paymentSelected,
                ]}
                onPress={() => setFormaPagamento("cartão")}
              >
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={formaPagamento === "cartão" ? "#fff" : "#007bff"}
                />
                <Text
                  style={[
                    styles.paymentText,
                    formaPagamento === "cartão" && styles.paymentTextSelected,
                  ]}
                >
                  Cartão
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentButton,
                  formaPagamento === "boleto" && styles.paymentSelected,
                ]}
                onPress={() => setFormaPagamento("boleto")}
              >
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={formaPagamento === "boleto" ? "#fff" : "#007bff"}
                />
                <Text
                  style={[
                    styles.paymentText,
                    formaPagamento === "boleto" && styles.paymentTextSelected,
                  ]}
                >
                  Boleto
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentButton,
                  formaPagamento === "pix" && styles.paymentSelected,
                ]}
                onPress={() => setFormaPagamento("pix")}
              >
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={formaPagamento === "pix" ? "#fff" : "#007bff"}
                />
                <Text
                  style={[
                    styles.paymentText,
                    formaPagamento === "pix" && styles.paymentTextSelected,
                  ]}
                >
                  Pix
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelar}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmar}
              >
                <Text style={styles.confirmText}>Confirmar Compra</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemName: { fontSize: 16, color: "#333" },
  itemPrice: { fontSize: 16, fontWeight: "600" },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
  },
  totalText: { fontSize: 18, fontWeight: "600", color: "#444" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#28a745" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 10,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  paymentSelected: {
    backgroundColor: "#007bff",
  },
  paymentText: {
    marginLeft: 6,
    fontSize: 15,
    color: "#007bff",
  },
  paymentTextSelected: {
    color: "#fff",
  },

  buttonsContainer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#dc3545",
    borderRadius: 10,
    paddingVertical: 14,
    width: "40%",
    alignItems: "center",
  },
  cancelText: {
    color: "#dc3545",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    paddingVertical: 14,
    width: "55%",
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});