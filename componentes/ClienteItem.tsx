// componentes/ClienteItem.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ClientItemProps {
  client: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;  // ← HACER OPCIONAL
  showAdminControls?: boolean;
}

export default function ClientItem({
                                     client,
                                     onEdit,
                                     onDelete,
                                     onSelect,
                                     showAdminControls = false
                                   }: ClientItemProps) {

  const CardContent = () => (
      <View style={styles.card}>
        <Text style={styles.name}>
          {client.nombre} {client.apellido}
        </Text>
        <Text style={styles.text}>{client.correo}</Text>
        <Text style={styles.text}>{client.fecha}</Text>

        {showAdminControls && (onEdit || onDelete) && (
            <View style={styles.actions}>
              {onEdit && (
                  <TouchableOpacity style={styles.edit} onPress={onEdit}>
                    <Text style={styles.btnText}>Editar</Text>
                  </TouchableOpacity>
              )}
              {onDelete && (
                  <TouchableOpacity style={styles.delete} onPress={onDelete}>
                    <Text style={styles.btnText}>Eliminar</Text>
                  </TouchableOpacity>
              )}
            </View>
        )}
      </View>
  );

  // Si hay onSelect, envolver en TouchableOpacity
  if (onSelect) {
    return (
        <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
          <CardContent />
        </TouchableOpacity>
    );
  }

  // Si no, retornar solo el contenido
  return <CardContent />;
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