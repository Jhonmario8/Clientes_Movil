import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ClientForm({
  nombre, apellido, correo, fecha,
  setNombre, setApellido, setCorreo, setFecha,
  onSave, editing, onCancel
}: any) {
  return (
    <View style={styles.card}>

      <TextInput
        placeholder="Nombre"
        placeholderTextColor="#94A3B8"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="Apellido"
        placeholderTextColor="#94A3B8"
        value={apellido}
        onChangeText={setApellido}
        style={styles.input}
      />

      <TextInput
        placeholder="Correo"
        placeholderTextColor="#94A3B8"
        value={correo}
        onChangeText={setCorreo}
        style={styles.input}
      />

      <TextInput
        placeholder="Fecha (YYYY-MM-DD)"
        placeholderTextColor="#94A3B8"
        value={fecha}
        onChangeText={setFecha}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onSave}>
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