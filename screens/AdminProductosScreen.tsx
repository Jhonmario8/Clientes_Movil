// pantallas/AdminProductosScreen.tsx
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert
} from "react-native";
import ProductoForm from "../componentes/ProductForm";
import ProductoAdminItem from "../componentes/ProductAdminItem";
import { Product } from "../modelo/Product";
import { getProductos, saveProducto, deleteProducto } from "../services/firebaseService";
import { useAuth } from "../context/AuthContext";

export default function AdminProductosScreen({ navigation }: any) {
  const { isAdmin } = useAuth();
  const [productos, setProductos] = useState<Product[]>([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [stock, setStock] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar acceso de administrador
    if (!isAdmin) {
      Alert.alert(
          "Acceso denegado",
          "Solo los administradores pueden acceder a esta sección",
          [{ text: "OK", onPress: () => navigation.replace("Inicio") }]
      );
      return;
    }
    cargarProductos();
  }, [isAdmin]);

  const cargarProductos = async () => {
    console.log('🔄 Cargando productos...');
    setLoading(true);
    const productosDB = await getProductos();
    console.log('📦 Productos cargados:', productosDB.length);
    setProductos(productosDB);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!nombre || !descripcion || !valorUnitario || !stock) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const precio = parseFloat(valorUnitario);
    const cantidadStock = parseInt(stock);

    if (isNaN(precio) || precio <= 0) {
      Alert.alert("Error", "El valor unitario debe ser un número mayor a 0");
      return;
    }

    if (isNaN(cantidadStock) || cantidadStock < 0) {
      Alert.alert("Error", "El stock debe ser un número mayor o igual a 0");
      return;
    }

    const producto: Product = {
      id: editingId || Date.now().toString(),
      nombre,
      descripcion,
      valorUnitario: precio,
      stock: cantidadStock
    };

    console.log('💾 Guardando producto:', producto.nombre);
    const success = await saveProducto(producto);

    if (success) {
      await cargarProductos();
      limpiarFormulario();
      Alert.alert("Éxito", editingId ? "Producto actualizado" : "Producto creado");
    } else {
      Alert.alert("Error", "No se pudo guardar el producto");
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setValorUnitario('');
    setStock('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (producto: Product) => {
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setValorUnitario(producto.valorUnitario.toString());
    setStock(producto.stock.toString());
    setEditingId(producto.id);
    setShowForm(true);
  };

  const handleDelete = (id: string, nombre: string) => {
    Alert.alert(
        "Confirmar eliminación",
        `¿Estás seguro de eliminar "${nombre}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              const success = await deleteProducto(id);
              if (success) {
                await cargarProductos();
                Alert.alert("Éxito", "Producto eliminado");
              } else {
                Alert.alert("Error", "No se pudo eliminar el producto");
              }
            }
          }
        ]
    );
  };

  // Si no es admin, mostrar mensaje mientras redirige
  if (!isAdmin) {
    return (
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.accessDenied}>Acceso denegado</Text>
          <Text style={styles.accessDeniedSub}>Redirigiendo...</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Administrar Productos</Text>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>👑 Modo Administrador</Text>
          </View>
        </View>

        {!showForm && (
            <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
              <Text style={styles.addButtonText}>➕ Agregar Nuevo Producto</Text>
            </TouchableOpacity>
        )}

        {showForm && (
            <ProductoForm
                nombre={nombre}
                descripcion={descripcion}
                valorUnitario={valorUnitario}
                stock={stock}
                setNombre={setNombre}
                setDescripcion={setDescripcion}
                setValorUnitario={setValorUnitario}
                setStock={setStock}
                onSave={handleSave}
                editing={!!editingId}
                onCancel={limpiarFormulario}
            />
        )}

        {loading ? (
            <Text style={styles.loading}>Cargando productos...</Text>
        ) : (
            <FlatList
                data={productos}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ProductoAdminItem
                        producto={item}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item.id, item.nombre)}
                    />
                )}
                ListEmptyComponent={
                  <Text style={styles.empty}>No hay productos registrados</Text>
                }
            />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 15,
  },
  title: {
    color: "#F1F5F9",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  adminBadge: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  adminBadgeText: {
    color: "#F1F5F9",
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#8B5CF6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: 16,
  },
  empty: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 20,
  },
  loading: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 20,
  },
  accessDenied: {
    color: "#EF4444",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  accessDeniedSub: {
    color: "#94A3B8",
    fontSize: 16,
  },
});