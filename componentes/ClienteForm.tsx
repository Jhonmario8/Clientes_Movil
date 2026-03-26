import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ClientForm({
  nombre, apellido, correo, fecha,
  setNombre, setApellido, setCorreo, setFecha,
  onSave, editing, onCancel,
  errors
}: any) {
  return (
    <View style={styles.card}>

      {/* Nombre */}
      <TextInput
        placeholder="Nombre"
        placeholderTextColor="#94A3B8"
        value={nombre}
        onChangeText={setNombre}
        style={[
          styles.input,
          errors?.nombre ? styles.inputError : null
        ]}
      />
      {errors?.nombre ? <Text style={styles.error}>{errors.nombre}</Text> : null}

      {/* Apellido */}
      <TextInput
        placeholder="Apellido"
        placeholderTextColor="#94A3B8"
        value={apellido}
        onChangeText={setApellido}
        style={[
          styles.input,
          errors?.apellido ? styles.inputError : null
        ]}
      />
      {errors?.apellido ? <Text style={styles.error}>{errors.apellido}</Text> : null}

      {/* Correo */}
      <TextInput
        placeholder="Correo"
        placeholderTextColor="#94A3B8"
        value={correo}
        onChangeText={setCorreo}
        style={[
          styles.input,
          errors?.correo ? styles.inputError : null
        ]}
      />
      {errors?.correo ? <Text style={styles.error}>{errors.correo}</Text> : null}

      {/* Fecha */}
      <TextInput
        placeholder="Fecha (YYYY-MM-DD)"
        placeholderTextColor="#94A3B8"
        value={fecha}
        onChangeText={setFecha}
        style={[
          styles.input,
          errors?.fecha ? styles.inputError : null
        ]}
      />
      {errors?.fecha ? <Text style={styles.error}>{errors.fecha}</Text> : null}

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
    marginBottom: 5,
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 1,
  },
  error: {
    color: "#EF4444",
    marginBottom: 8,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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