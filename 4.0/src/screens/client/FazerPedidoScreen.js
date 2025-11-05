import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Simulação de produtos vindos do banco de dados
const mockProducts = [
  { id: "1", name: "Shampoo Profissional", category: "profissional", price: 89.9 },
  { id: "2", name: "Máscara Reconstrutora", category: "profissional", price: 99.9 },
  { id: "3", name: "Leave-in Termoprotector", category: "home care", price: 59.9 },
  { id: "4", name: "Óleo Capilar", category: "home care", price: 49.9 },
];

export default function FazerPedidoScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    // Depois conectaremos ao banco (Firebase)
    setProducts(mockProducts);
  }, []);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => {
    Alert.alert("Esvaziar Carrinho", "Deseja remover todos os itens?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Esvaziar", onPress: () => setCart([]), style: "destructive" },
    ]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    setCartVisible(false);
    navigation.navigate("TelaPagamento", { cart, total: getTotal() });
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Ionicons name="add-circle" size={28} color="#28a745" />
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      <Text style={styles.cartName}>{item.name}</Text>
      <View style={styles.cartControls}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
          <Ionicons name="remove-circle-outline" size={26} color="#dc3545" />
        </TouchableOpacity>
        <Text style={styles.cartQty}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, +1)}>
          <Ionicons name="add-circle-outline" size={26} color="#28a745" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cartPrice}>
        R$ {(item.price * item.quantity).toFixed(2)}
      </Text>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Ionicons name="trash" size={22} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );

  const grouped = {
    profissional: products.filter((p) => p.category === "profissional"),
    homeCare: products.filter((p) => p.category === "home care"),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.sectionTitle}>Profissional</Text>
        <FlatList
          data={grouped.profissional}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          scrollEnabled={false}
        />

        <Text style={styles.sectionTitle}>Home Care</Text>
        <FlatList
          data={grouped.homeCare}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Botão flutuante de carrinho */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => setCartVisible(true)}
      >
        <Ionicons name="cart" size={24} color="#fff" />
        <Text style={styles.cartText}>{cart.length}</Text>
      </TouchableOpacity>

      {/* Modal do carrinho */}
      <Modal visible={cartVisible} animationType="slide">
        <SafeAreaView style={styles.cartContainer}>
          <View style={styles.cartHeader}>
            <TouchableOpacity onPress={() => setCartVisible(false)}>
              <Ionicons name="arrow-back" size={28} color="#007bff" />
            </TouchableOpacity>
            <Text style={styles.cartTitle}>Meu Carrinho</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {cart.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#777" }}>
                Carrinho vazio
              </Text>
            ) : (
              cart.map(renderCartItem)
            )}
          </ScrollView>

          {cart.length > 0 && (
            <View style={styles.cartFooter}>
              <Text style={styles.cartTotal}>
                Total: R$ {getTotal().toFixed(2)}
              </Text>

              <View style={styles.cartButtons}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearCart}
                >
                  <Text style={styles.clearText}>Esvaziar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                >
                  <Text style={styles.checkoutText}>Finalizar Compra</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { padding: 16, paddingBottom: 80 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 10,
    color: "#333",
  },
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  productName: { fontSize: 16, fontWeight: "600", color: "#333" },
  productPrice: { color: "#666", fontSize: 15 },
  addButton: { padding: 4 },

  cartButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  cartText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 16,
  },

  cartContainer: { flex: 1, backgroundColor: "#fff" },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cartTitle: { fontSize: 20, fontWeight: "700" },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  cartName: { fontSize: 15, flex: 1, fontWeight: "500" },
  cartControls: { flexDirection: "row", alignItems: "center", gap: 8 },
  cartQty: { fontSize: 16, fontWeight: "bold", marginHorizontal: 6 },
  cartPrice: { width: 80, textAlign: "right", fontWeight: "600" },
  cartFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  cartButtons: { flexDirection: "row", justifyContent: "space-between" },
  clearButton: {
    borderWidth: 1,
    borderColor: "#dc3545",
    padding: 10,
    borderRadius: 10,
    width: "35%",
    alignItems: "center",
  },
  clearText: { color: "#dc3545", fontWeight: "bold" },
  checkoutButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});