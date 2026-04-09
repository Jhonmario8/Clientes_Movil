// componentes/ProductoItem.tsx
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from "react-native";
import { Product } from "../modelo/Product";

interface ProductoItemProps {
  producto: Product;
  onAgregar: (producto: Product, cantidad: number) => void;
  showToast: (message: string, type: "success" | "error" | "info" | "warning") => void;
}

export default function ProductoItem({ producto, onAgregar, showToast }: ProductoItemProps) {
  const [cantidad, setCantidad] = useState("1");
  const [showInput, setShowInput] = useState(false);

  const handleAgregar = () => {
    const cantidadNum = parseInt(cantidad);
    

    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      showToast("Ingrese una cantidad válida (mayor a 0)", "error");
      return;
    }
    
    // Validar stock
    if (cantidadNum > producto.stock) {
      showToast(`Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}`, "error");
      return;
    }
    
    // Si todo está bien, agregar al carrito
    onAgregar(producto, cantidadNum);
    setShowInput(false);
    setCantidad("1");
  };

  const handleSinStock = () => {
    showToast(`${producto.nombre} no tiene unidades disponibles`, "warning");
  };

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

      {showInput ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="numeric"
            placeholder="Cant."
            placeholderTextColor="#94A3B8"
            autoFocus
          />
          <TouchableOpacity style={styles.confirmarBtn} onPress={handleAgregar}>
            <Text style={styles.confirmarText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelarBtn} 
            onPress={() => {
              setShowInput(false);
              setCantidad("1");
            }}
          >
            <Text style={styles.cancelarText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={[
            styles.agregarBtn,
            producto.stock === 0 && styles.agregarBtnDisabled
          ]} 
          onPress={() => {
            if (producto.stock === 0) {
              handleSinStock();
              return;
            }
            setShowInput(true);
          }}
        >
          <Text style={styles.agregarText}>
            {producto.stock === 0 ? "Sin Stock" : "Agregar"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
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
  agregarBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  agregarBtnDisabled: {
    backgroundColor: "#6B7280",
  },
  agregarText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  input: {
    backgroundColor: "#0F172A",
    color: "#F1F5F9",
    padding: 8,
    borderRadius: 6,
    width: 60,
    textAlign: "center",
  },
  confirmarBtn: {
    backgroundColor: "#22C55E",
    padding: 8,
    borderRadius: 6,
  },
  confirmarText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
  cancelarBtn: {
    backgroundColor: "#EF4444",
    padding: 8,
    borderRadius: 6,
  },
  cancelarText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
});