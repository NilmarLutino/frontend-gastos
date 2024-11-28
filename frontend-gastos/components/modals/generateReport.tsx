import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DateRangeModalProps {
  visible: boolean;
  onClose: () => void;
  onViewReport: (
    startDate: string,
    endDate: string,
    reportType: string
  ) => void;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({
  visible,
  onClose,
  onViewReport,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"start" | "end">("start");

  const isValidDate = (date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false;
    }

    const [year, month, day] = date.split("-").map(Number);
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) return false;
    if (month < 1 || month > 12) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    return true;
  };

  const handleViewReport = () => {
    if (!startDate || !endDate) {
      setErrorMessage("Ambas fechas son obligatorias.");
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      setErrorMessage(
        "Las fechas deben ser válidas y tener el formato YYYY-MM-DD."
      );
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorMessage(
        "La fecha de inicio no puede ser mayor que la fecha de fin."
      );
      return;
    }

    setErrorMessage("");
    const reportType = "Usuario";
    onViewReport(startDate, endDate, reportType);
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      if (pickerTarget === "start") {
        setStartDate(formattedDate);
      } else {
        setEndDate(formattedDate);
      }
    }
  };

  const openPicker = (target: "start" | "end") => {
    setPickerTarget(target);
    setShowPicker(true);
  };

  const formatDateInput = (text: string, setDate: (date: string) => void) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    let formatted = cleaned;
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 4) + "-" + cleaned.slice(4);
    }
    if (cleaned.length >= 6) {
      formatted = formatted.slice(0, 7) + "-" + cleaned.slice(6);
    }
    setDate(formatted);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>SELECCIONAR RANGO DE FECHAS</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Fecha Inicio:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={startDate}
                onChangeText={(text) => formatDateInput(text, setStartDate)}
                keyboardType="numeric"
                maxLength={10}
              />
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => openPicker("start")}
              >
                <Text style={styles.pickerButtonText}>📅</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Fecha Fin:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={endDate}
                onChangeText={(text) => formatDateInput(text, setEndDate)}
                keyboardType="numeric"
                maxLength={10}
              />
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => openPicker("end")}
              >
                <Text style={styles.pickerButtonText}>📅</Text>
              </TouchableOpacity>
            </View>
          </View>
          {showPicker && (
            <DateTimePicker
              value={
                pickerTarget === "start" && startDate
                  ? new Date(startDate)
                  : new Date()
              }
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleDateChange}
            />
          )}
          {errorMessage && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleViewReport}>
              <Text style={styles.buttonText}>Ver Reporte</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#FDF6F0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#262626",
  },
  dateContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderColor: "#B0B0B0",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  pickerButton: {
    marginLeft: 10,
  },
  pickerButtonText: {
    fontSize: 24,
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#C1121F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DateRangeModal;
