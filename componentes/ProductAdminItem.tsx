// componentes/ProductoAdminItem.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Product } from "../modelo/Product";

interface ProductoAdminItemProps {
  producto: Product;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductoAdminItem({ producto, onEdit, onDelete }: ProductoAdminItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.descripcion}>{producto.descripcion}</Text>
        <Text style={styles.precio}>${producto.valorUnitario.toFixed(2)}</Text>
        <Text style={[
          styles.stock,
          producto.stock < 5 && styles.stockBajo
        ]}>
          Stock: {producto.stock} unidades
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.edit} onPress={onEdit}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.delete} onPress={onDelete}>
          <Text style={styles.btnText}>Eliminar</Text>
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
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 10,
  },
  nombre: {
    color: "#F1F5F9",
    fontSize: 16,
    fontWeight: "bold",
  },
  descripcion: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  precio: {
    color: "#10B981",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  stock: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  stockBajo: {
    color: "#EF4444",
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