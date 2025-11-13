import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// ADMIN
import AdminLoginScreen from "./src/screens/admin/AdminLoginScreen";
import AdminHomeScreen from "./src/screens/admin/AdminHomeScreen";
import ProductsScreen from "./src/screens/admin/ProductsScreen"; // A importação duplicada foi removida
import ClientsScreen from "./src/screens/admin/ClientsScreen";

// CLIENTE
import ClientLoginScreen from "./src/screens/client/ClientLoginScreen";
import ClientHomeScreen from "./src/screens/client/ClientHomeScreen";
import FazerPedidoScreen from "./src/screens/client/FazerPedidoScreen";
import SolicitarVisitaScreen from "./src/screens/client/SolicitarVisitaScreen";
import HistoricoComprasScreen from "./src/screens/client/HistoricoComprasScreen";
import ChatRepresentanteScreen from "./src/screens/client/ChatRepresentanteScreen";
import TelaPagamento from "./src/screens/client/TelaPagamento";

const AdminStack = createStackNavigator();
const ClientStack = createStackNavigator();
const RootStack = createStackNavigator();

function AdminRoutes() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen
        name="AdminLogin"
        component={AdminLoginScreen}
        options={{ headerShown: false }}
      />
      <AdminStack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ title: "Painel Admin" }}
      />
      <AdminStack.Screen name="Produtos" component={ProductsScreen} />
      <AdminStack.Screen name="Clientes" component={ClientsScreen} />
    </AdminStack.Navigator>
  );
}

function ClientRoutes() {
  return (
    <ClientStack.Navigator>
      <ClientStack.Screen
        name="ClientLogin"
        component={ClientLoginScreen}
        options={{ headerShown: false }}
      />
      <ClientStack.Screen
        name="ClientHome"
        component={ClientHomeScreen}
        options={{ title: "Área do Cliente" }}
      />
      <ClientStack.Screen
        name="FazerPedido"
        component={FazerPedidoScreen}
        options={{ title: "Fazer Pedido" }}
      />
      <ClientStack.Screen
        name="SolicitarVisita"
        component={SolicitarVisitaScreen}
        options={{ title: "Solicitar Visita" }}
      />
      <ClientStack.Screen
        name="HistoricoCompras"
        component={HistoricoComprasScreen}
        options={{ title: "Histórico de Compras" }}
      />
      <ClientStack.Screen
        name="ChatRepresentante"
        component={ChatRepresentanteScreen}
        options={{ title: "Fale com o Representante" }}
      />
      <ClientStack.Screen
        name="TelaPagamento"
        component={TelaPagamento}
        options={{ title: "Pagamento" }}
      />
    </ClientStack.Navigator>
  );
}

function EntryScreen({ navigation }) {
  return (
    <View style={styles.entryContainer}>
      <Text style={styles.title}>NOME DO APP</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007bff" }]}
        onPress={() => navigation.navigate("Admin")}
      >
        <Text style={styles.buttonText}>Entrar como ADMIN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#28a745" }]}
        onPress={() => navigation.navigate("Client")}
      >
        <Text style={styles.buttonText}>Entrar como CLIENTE</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Entry" component={EntryScreen} />
        <RootStack.Screen name="Admin" component={AdminRoutes} />
        <RootStack.Screen name="Client" component={ClientRoutes} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  entryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 50,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});