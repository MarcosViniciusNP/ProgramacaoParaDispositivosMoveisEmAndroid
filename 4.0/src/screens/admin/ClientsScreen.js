import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

function formatCNPJ(value) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  let formatted = digits;
  if (digits.length > 2) formatted = digits.slice(0, 2) + "." + digits.slice(2);
  if (digits.length > 5) formatted = formatted.slice(0, 6) + "." + formatted.slice(6);
  if (digits.length > 8) formatted = formatted.slice(0, 10) + "/" + formatted.slice(10);
  if (digits.length > 12) formatted = formatted.slice(0, 15) + "-" + formatted.slice(15);
  return formatted;
}

export default function ClientsScreen() {
  const [clients, setClients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    cnpj: "",
    nomeReal: "",
    nomeFantasia: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const openNewClient = () => {
    setForm({
      cnpj: "",
      nomeReal: "",
      nomeFantasia: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
    });
    setModalVisible(true);
  };

  const openEdit = (client) => {
    setForm(client);
    setModalVisible(true);
  };

  const handleSave = () => {
    const { cnpj, nomeReal, nomeFantasia, rua, numero, bairro, cidade } = form;
    if (!cnpj || !nomeReal || !nomeFantasia || !rua || !numero || !bairro || !cidade) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    const enderecoCompleto = `${form.rua}, ${form.numero}${
      form.complemento ? " - " + form.complemento : ""
    }, ${form.bairro}, ${form.cidade}`;

    if (form.id) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === form.id
            ? { ...form, endereco: enderecoCompleto }
            : c
        )
      );
    } else {
      const newClient = {
        ...form,
        id: Date.now().toString(),
        endereco: enderecoCompleto,
        historico: [],
        visitaSolicitada: null,
        mensagens: [],
        temNovaMensagem: false,
      };
      setClients((prev) => [...prev, newClient]);
    }

    setModalVisible(false);
  };

  const handleDelete = (client) => {
    Alert.alert("Excluir cliente", `Deseja excluir ${client.nomeFantasia}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => setClients((prev) => prev.filter((c) => c.id !== client.id)),
      },
    ]);
  };

  const filteredClients = clients.filter((c) => {
    const termo = filter.toLowerCase();
    return (
      c.bairro?.toLowerCase().includes(termo) ||
      c.cidade?.toLowerCase().includes(termo)
    );
  });

  const openChat = (client) => {
    // Quando o admin abre, limpa o status de nova mensagem
    setSelectedClient({
      ...client,
      temNovaMensagem: false,
    });
    setClients((prev) =>
      prev.map((c) =>
        c.id === client.id ? { ...c, temNovaMensagem: false } : c
      )
    );
    setChatModalVisible(true);
  };

  const handleSendMessage = () => {
    if (!msgInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      autor: "admin",
      texto: msgInput.trim(),
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? { ...c, mensagens: [...c.mensagens, newMessage] }
          : c
      )
    );

    setSelectedClient((prev) => ({
      ...prev,
      mensagens: [...(prev.mensagens || []), newMessage],
    }));

    setMsgInput("");
  };

  const renderClient = ({ item }) => {
    let bgColor = "#fafafa";
    if (item.visitaSolicitada) bgColor = "#ffe5e5"; // vermelho leve
    if (item.temNovaMensagem) bgColor = "#fff8dc"; // amarelo claro

    return (
      <TouchableOpacity onPress={() => openChat(item)}>
        <View style={[styles.card, { backgroundColor: bgColor }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nomeFantasia}>{item.nomeFantasia}</Text>
            <Text style={styles.sub}>
              {item.nomeReal} • CNPJ: {item.cnpj}
            </Text>
            <Text style={styles.sub}>{item.endereco}</Text>

            {item.visitaSolicitada && (
              <Text style={styles.visitaText}>
                📅 VISITA SOLICITADA PARA {item.visitaSolicitada.data} às{" "}
                {item.visitaSolicitada.hora}
              </Text>
            )}
            {item.temNovaMensagem && (
              <Text style={styles.msgAlert}>💬 NOVAS MENSAGENS RECEBIDAS</Text>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnEdit]}
              onPress={() => openEdit(item)}
            >
              <Text style={styles.btnText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnDel]}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Carregando clientes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>

      <TextInput
        style={styles.filterInput}
        placeholder="Filtrar por bairro ou cidade..."
        value={filter}
        onChangeText={setFilter}
      />

      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        renderItem={renderClient}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Nenhum cliente cadastrado.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.fab} onPress={openNewClient}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Modal de chat */}
      <Modal visible={chatModalVisible} animationType="slide">
        <View style={styles.chatContainer}>
          <Text style={styles.chatTitle}>
            Chat com {selectedClient?.nomeFantasia || ""}
          </Text>

          <ScrollView
            style={styles.chatArea}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {selectedClient?.mensagens?.length > 0 ? (
              selectedClient.mensagens.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.bubble,
                    msg.autor === "admin"
                      ? styles.bubbleAdmin
                      : styles.bubbleCliente,
                  ]}
                >
                  <Text style={styles.msgText}>{msg.texto}</Text>
                  <Text style={styles.msgHora}>{msg.hora}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhuma mensagem trocada.</Text>
            )}
          </ScrollView>

          <View style={styles.chatFooter}>
            <TextInput
              style={styles.chatInput}
              placeholder="Digite uma resposta..."
              value={msgInput}
              onChangeText={setMsgInput}
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendText}>➤</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setChatModalVisible(false)}
          >
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 10 },
  filterInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  nomeFantasia: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  sub: { color: "#666", fontSize: 14 },
  visitaText: { marginTop: 5, color: "#dc3545", fontWeight: "600" },
  msgAlert: { marginTop: 4, color: "#b8860b", fontWeight: "600" },
  actions: { flexDirection: "row", gap: 8, marginLeft: 10 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  btnEdit: { backgroundColor: "#0d6efd" },
  btnDel: { backgroundColor: "#dc3545" },
  btnText: { color: "#fff", fontWeight: "700" },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0d6efd",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 30, lineHeight: 30, marginTop: -2 },
  center: { alignItems: "center", justifyContent: "center", padding: 24 },

  // CHAT
  chatContainer: { flex: 1, backgroundColor: "#fff", padding: 10 },
  chatTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  chatArea: { flex: 1 },
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  bubbleCliente: {
    backgroundColor: "#e9ecef",
    alignSelf: "flex-start",
  },
  bubbleAdmin: {
    backgroundColor: "#d1e7dd",
    alignSelf: "flex-end",
  },
  msgText: { fontSize: 15, color: "#333" },
  msgHora: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  chatFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  sendBtn: {
    backgroundColor: "#28a745",
    borderRadius: 25,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  sendText: { color: "#fff", fontSize: 20 },
  closeBtn: {
    alignSelf: "center",
    marginTop: 10,
  },
  closeText: { color: "#007bff", fontWeight: "bold", fontSize: 16 },
});