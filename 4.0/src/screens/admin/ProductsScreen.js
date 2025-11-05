import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productsService";

const CATEGORIES = ["home care", "profissional", "outros"];

export default function ProductsScreen() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("todos");

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null); // product | null
  const [form, setForm] = useState({ category: "home care", name: "", price: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await listProducts();
        setProducts(data);
      } catch (e) {
        Alert.alert("Erro", "Falha ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "todos") return products;
    return products.filter((p) => p.category === filter);
  }, [products, filter]);

  function openCreate() {
    setEditing(null);
    setForm({ category: "home care", name: "", price: "" });
    setModalVisible(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      category: p.category,
      name: p.name,
      price: String(p.price),
    });
    setModalVisible(true);
  }

  async function onDelete(p) {
    Alert.alert("Excluir produto", `Deseja excluir "${p.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(p.id);
            setProducts((prev) => prev.filter((x) => x.id !== p.id));
          } catch {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  }

  function validate() {
    if (!form.name.trim()) return "Informe o nome.";
    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) return "Preço inválido.";
    if (!CATEGORIES.includes(form.category)) return "Categoria inválida.";
    return null;
  }

  async function onSave() {
    const err = validate();
    if (err) {
      Alert.alert("Atenção", err);
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateProduct(editing.id, {
          category: form.category,
          name: form.name.trim(),
          price: Number(form.price),
        });
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await createProduct({
          category: form.category,
          name: form.name.trim(),
          price: Number(form.price),
        });
        setProducts((prev) => [created, ...prev]);
      }
      setModalVisible(false);
    } catch {
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.category} • R$ {item.price.toFixed(2)}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.btnEdit]} onPress={() => openEdit(item)}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnDel]} onPress={() => onDelete(item)}>
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Carregando produtos…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Produtos</Text>

      {/* Filtros */}
      <View style={styles.filtersRow}>
        {["todos", ...CATEGORIES].map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, filter === c && styles.chipActive]}
            onPress={() => setFilter(c)}
          >
            <Text style={[styles.chipText, filter === c && styles.chipTextActive]}>
              {c === "todos" ? "Todos" : c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Nenhum produto cadastrado.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Botão flutuante adicionar */}
      <TouchableOpacity style={styles.fab} onPress={openCreate}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Modal de criação/edição */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editing ? "Editar produto" : "Novo produto"}
            </Text>

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.pillRow}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.pill, form.category === c && styles.pillActive]}
                  onPress={() => setForm((f) => ({ ...f, category: c }))}
                >
                  <Text
                    style={[styles.pillText, form.category === c && styles.pillTextActive]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do produto"
              value={form.name}
              onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
            />

            <Text style={styles.label}>Preço (R$)</Text>
            <TextInput
              style={styles.input}
              placeholder="0,00"
              keyboardType="decimal-pad"
              value={String(form.price)}
              onChangeText={(t) => setForm((f) => ({ ...f, price: t.replace(",", ".") }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnGhost]}
                disabled={saving}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.btnText, styles.btnGhostText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={onSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  filtersRow: { flexDirection: "row", gap: 8, marginBottom: 12, flexWrap: "wrap" },
  chip: {
    borderWidth: 1, borderColor: "#ddd", paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 20,
  },
  chipActive: { backgroundColor: "#007bff20", borderColor: "#007bff" },
  chipText: { color: "#333" },
  chipTextActive: { color: "#007bff", fontWeight: "600" },

  card: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12, marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  name: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  meta: { color: "#666" },
  actions: { flexDirection: "row", gap: 8, marginLeft: 10 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  btnEdit: { backgroundColor: "#0d6efd" },
  btnDel: { backgroundColor: "#dc3545" },
  btnText: { color: "#fff", fontWeight: "700" },

  fab: {
    position: "absolute", right: 16, bottom: 24,
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#0d6efd",
    alignItems: "center", justifyContent: "center", elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 30, lineHeight: 30, marginTop: -2 },

  center: { alignItems: "center", justifyContent: "center", padding: 24 },

  modalBackdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center", justifyContent: "flex-end",
  },
  modalCard: {
    width: "100%", backgroundColor: "#fff", borderTopLeftRadius: 18, borderTopRightRadius: 18,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  label: { fontWeight: "600", marginTop: 8, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, fontSize: 16,
  },
  pillRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  pill: { borderWidth: 1, borderColor: "#ddd", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  pillActive: { borderColor: "#0d6efd", backgroundColor: "#0d6efd20" },
  pillText: { color: "#333" },
  pillTextActive: { color: "#0d6efd", fontWeight: "700" },

  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 14 },
  btnSave: { backgroundColor: "#28a745" },
  btnGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#ccc" },
  btnGhostText: { color: "#333" },
});