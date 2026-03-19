import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ClientForm({
  nombre, apellido, correo, fecha,
  setNombre, setApellido, setCorreo, setFecha,
  onSave, editing
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

      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>
          {editing ? "Actualizar" : "Crear"}
        </Text>
      </TouchableOpacity>

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
  button: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
});