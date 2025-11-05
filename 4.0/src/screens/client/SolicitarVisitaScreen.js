import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";

export default function SolicitarVisitaScreen({ navigation }) {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hourModalVisible, setHourModalVisible] = useState(false);
  const [hour, setHour] = useState("");

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Gera os dias do mês atual
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const openCalendar = () => setCalendarVisible(true);

  const handleSelectDay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setCalendarVisible(false);

    Alert.alert(
      "Confirmar Solicitação",
      `Solicitar visita para ${day}/${currentMonth + 1}/${currentYear}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          onPress: () => setHourModalVisible(true),
        },
      ]
    );
  };

  const handleConfirmHour = () => {
    if (!hour.trim()) {
      Alert.alert("Atenção", "Informe o horário da visita.");
      return;
    }

    const dateStr = `${selectedDate.getDate()}/${
      selectedDate.getMonth() + 1
    }/${selectedDate.getFullYear()} às ${hour}`;

    Alert.alert(
      "Visita Solicitada!",
      `Sua solicitação foi enviada para ${dateStr}`,
      [
        {
          text: "OK",
          onPress: () => {
            setHourModalVisible(false);
            setHour("");
            navigation.navigate("ClientHome");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Solicitar Visita Técnica</Text>
        <TouchableOpacity style={styles.button} onPress={openCalendar}>
          <Text style={styles.buttonText}>📅 Solicitar Visita</Text>
        </TouchableOpacity>

        {/* Modal do calendário */}
        <Modal visible={calendarVisible} animationType="slide">
          <SafeAreaView style={styles.calendarContainer}>
            <Text style={styles.calendarTitle}>
              Selecione uma data ({currentMonth + 1}/{currentYear})
            </Text>
            <View style={styles.daysGrid}>
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={styles.dayBox}
                  onPress={() => handleSelectDay(day)}
                >
                  <Text style={styles.dayText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelCalendar}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        {/* Modal de hora */}
        <Modal visible={hourModalVisible} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Escolher horário</Text>
              <TextInput
                placeholder="Ex: 14:00"
                style={styles.input}
                value={hour}
                onChangeText={setHour}
                keyboardType="numeric"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnCancel]}
                  onPress={() => setHourModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnConfirm]}
                  onPress={handleConfirmHour}
                >
                  <Text style={styles.btnConfirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  calendarContainer: { flex: 1, padding: 16, backgroundColor: "#fff" },
  calendarTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  dayBox: {
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
  },
  dayText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cancelCalendar: {
    alignSelf: "center",
    marginTop: 20,
  },
  cancelText: {
    color: "#dc3545",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnCancel: { borderWidth: 1, borderColor: "#dc3545", marginRight: 8 },
  btnConfirm: { backgroundColor: "#28a745", marginLeft: 8 },
  btnConfirmText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});