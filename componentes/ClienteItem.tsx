// componentes/ClienteItem.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ClientItem({ client, onEdit, onDelete, onSelect }: any) {
  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
      <View style={styles.card}>
        <Text style={styles.name}>
          {client.nombre} {client.apellido}
        </Text>
        <Text style={styles.text}>{client.correo}</Text>
        <Text style={styles.text}>{client.fecha}</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.edit} onPress={onEdit}>
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.delete} onPress={onDelete}>
            <Text style={styles.btnText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  name: {
    color: "#F1F5F9",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    color: "#94A3B8",
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  edit: {
    backgroundColor: "#22C55E",
    padding: 8,
    borderRadius: 6,
  },
  delete: {
    backgroundColor: "#EF4444",
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});