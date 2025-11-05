import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function ChatRepresentanteScreen() {
  const [mensagem, setMensagem] = useState("");
  const [conversa, setConversa] = useState([]);

  const handleEnviar = () => {
    if (!mensagem.trim()) return;

    const novaMsg = {
      id: Date.now().toString(),
      texto: mensagem.trim(),
      autor: "cliente", // depois podemos alternar
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversa((prev) => [...prev, novaMsg]);
    setMensagem("");
  };

  const handleCancelar = () => {
    if (!mensagem.trim()) return;

    Alert.alert(
      "Excluir mensagem",
      "Tem certeza que deseja excluir o texto atual?",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", onPress: () => setMensagem("") },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.bubble,
        item.autor === "cliente" ? styles.bubbleCliente : styles.bubbleAdmin,
      ]}
    >
      <Text style={styles.msgText}>{item.texto}</Text>
      <Text style={styles.msgHora}>{item.hora}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={conversa}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatArea}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma mensagem enviada ainda.
          </Text>
        }
      />

      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          maxLength={280}
          value={mensagem}
          onChangeText={setMensagem}
          multiline
        />
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelar}>
          <Text style={styles.cancelText}>✖</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendBtn} onPress={handleEnviar}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  chatArea: { flexGrow: 1, padding: 16 },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },

  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  bubbleCliente: {
    backgroundColor: "#d1e7dd",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  bubbleAdmin: {
    backgroundColor: "#e9ecef",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  msgText: { fontSize: 15, color: "#333" },
  msgHora: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  sendText: { color: "#fff", fontSize: 20 },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#dc3545",
    borderRadius: 25,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  cancelText: { color: "#dc3545", fontSize: 20, fontWeight: "bold" },
});