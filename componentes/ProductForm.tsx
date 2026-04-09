// componentes/ProductoForm.tsx
import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Platform
} from "react-native";

interface ProductoFormProps {
  nombre: string;
  descripcion: string;
  valorUnitario: string;
  stock: string;
  setNombre: (text: string) => void;
  setDescripcion: (text: string) => void;
  setValorUnitario: (text: string) => void;
  setStock: (text: string) => void;
  onSave: () => void;
  editing: boolean;
  onCancel: () => void;
}

export default function ProductoForm({
  nombre,
  descripcion,
  valorUnitario,
  stock,
  setNombre,
  setDescripcion,
  setValorUnitario,
  setStock,
  onSave,
  editing,
  onCancel
}: ProductoFormProps) {
  
  const handleSave = () => {
    if (!nombre || !descripcion || !valorUnitario || !stock) {
      if (Platform.OS === 'web') {
        window.alert('Todos los campos son obligatorios');
      } else {
        Alert.alert('Error', 'Todos los campos son obligatorios');
      }
      return;
    }

    const precio = parseFloat(valorUnitario);
    const cantidadStock = parseInt(stock);

    if (isNaN(precio) || precio <= 0) {
      if (Platform.OS === 'web') {
        window.alert('El valor unitario debe ser un número mayor a 0');
      } else {
        Alert.alert('Error', 'El valor unitario debe ser un número mayor a 0');
      }
      return;
    }

    if (isNaN(cantidadStock) || cantidadStock < 0) {
      if (Platform.OS === 'web') {
        window.alert('El stock debe ser un número mayor o igual a 0');
      } else {
        Alert.alert('Error', 'El stock debe ser un número mayor o igual a 0');
      }
      return;
    }

    onSave();
  };

  return (
    <View style={styles.card}>
      <TextInput
        placeholder="Nombre del producto"
        placeholderTextColor="#94A3B8"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción"
        placeholderTextColor="#94A3B8"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
        multiline
      />

      <TextInput
        placeholder="Valor Unitario ($)"
        placeholderTextColor="#94A3B8"
        value={valorUnitario}
        onChangeText={setValorUnitario}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Stock (unidades)"
        placeholderTextColor="#94A3B8"
        value={stock}
        onChangeText={setStock}
        style={styles.input}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {editing ? "Actualizar" : "Crear"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#0F172A",
    color: "#F1F5F9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#6B7280",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
});