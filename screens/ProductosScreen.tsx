// pantallas/ProductosScreen.tsx
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native";
import ProductoItem from "../componentes/ProductoItem";
import { Product } from "../modelo/Product";
import CarritoDrawer from "../componentes/CarritoDrawer";
import { Encabezado } from "../modelo/Encabezado";
import ToastPersonalizado from "../componentes/ToastPersonalizado";
import { useToast } from "../componentes/useToast";
import { getProductos, saveCompra } from "../services/firebaseService";
import { useAuth } from "../context/AuthContext";

interface ProductosScreenProps {
  navigation: any;
}

export default function ProductosScreen({ navigation }: ProductosScreenProps) {
  const { user, rol } = useAuth();  // ← OBTENER USUARIO AUTENTICADO

  const [productos, setProductos] = useState<Product[]>([]);
  const [carrito, setCarrito] = useState<Array<{producto: Product, cantidad: number}>>([]);
  const [showCarrito, setShowCarrito] = useState(false);
  const [loading, setLoading] = useState(true);

  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    console.log('🔄 Cargando productos...');
    setLoading(true);
    const productosDB = await getProductos();
    console.log('📦 Productos cargados:', productosDB.length);
    setProductos(productosDB);
    setLoading(false);
  };

  const mostrarMensaje = (mensaje: string, tipo: "success" | "error" | "info" | "warning" = "info") => {
    if (Platform.OS === 'web') {
      showToast(mensaje, tipo);
    } else {
      Alert.alert(tipo === "success" ? "Éxito" : tipo === "error" ? "Error" : "Información", mensaje);
    }
  };

  const agregarAlCarrito = (producto: Product, cantidad: number) => {
    // Ya no necesitamos validar cliente seleccionado
    // El usuario autenticado SIEMPRE puede comprar

    const itemExistente = carrito.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (nuevaCantidad > producto.stock) {
        mostrarMensaje(`Stock insuficiente. Solo hay ${producto.stock} unidades disponibles.`, "error");
        return;
      }
    } else {
      if (cantidad > producto.stock) {
        mostrarMensaje(`Stock insuficiente. Solo hay ${producto.stock} unidades disponibles.`, "error");
        return;
      }
    }

    if (itemExistente) {
      setCarrito(prev =>
          prev.map(item =>
              item.producto.id === producto.id
                  ? { ...item, cantidad: item.cantidad + cantidad }
                  : item
          )
      );
      mostrarMensaje(`Se agregaron ${cantidad} unidad(es) más de ${producto.nombre}`, "success");
    } else {
      setCarrito(prev => [...prev, { producto, cantidad }]);
      mostrarMensaje(`${producto.nombre} agregado al carrito (${cantidad} unidad(es))`, "success");
    }
  };

  const actualizarCantidadCarrito = (productoId: string, nuevaCantidad: number) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    if (nuevaCantidad > producto.stock) {
      mostrarMensaje(`Stock insuficiente. Máximo disponible: ${producto.stock}`, "error");
      return;
    }

    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    setCarrito(prev =>
        prev.map(item =>
            item.producto.id === productoId
                ? { ...item, cantidad: nuevaCantidad }
                : item
        )
    );
    mostrarMensaje(`Cantidad actualizada`, "success");
  };

  const eliminarDelCarrito = (productoId: string) => {
    const item = carrito.find(i => i.producto.id === productoId);
    setCarrito(prev => prev.filter(item => item.producto.id !== productoId));

    if (item) {
      mostrarMensaje(`${item.producto.nombre} fue removido del carrito`, "info");
    }
  };

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) =>
        total + (item.producto.valorUnitario * item.cantidad), 0
    );
  };

  const procesarCompra = async () => {
    if (carrito.length === 0) {
      mostrarMensaje("Agregue productos al carrito antes de comprar", "warning");
      return;
    }

    // El cliente es el usuario autenticado
    const clienteInfo = {
      id: user.uid,
      nombre: user.email?.split('@')[0] || 'Usuario',
      email: user.email
    };

    const subTotal = calcularSubtotal();
    const descuento = subTotal > 100 ? subTotal * 0.10 : 0;
    const total = subTotal - descuento;

    const encabezadoId = Date.now().toString();

    const encabezado: Encabezado = {
      id: encabezadoId,
      idCliente: user.uid,  // ← USAR UID DEL USUARIO AUTENTICADO
      fecha: new Date().toISOString().split('T')[0],
      subTotal,
      descuentoTotal: descuento,
      total
    };

    const detalles = carrito.map(item => ({
      id: Date.now().toString() + Math.random().toString(),
      idEncabezado: encabezadoId,
      idProducto: item.producto.id,
      cantidad: item.cantidad,
      valor: item.producto.valorUnitario
    }));

    console.log('🛒 Procesando compra para usuario:', user.email);
    const success = await saveCompra(encabezado, detalles);

    if (success) {
      await cargarProductos();
      setCarrito([]);
      setShowCarrito(false);
      mostrarMensaje(
          `¡Compra exitosa! Total: $${total.toFixed(2)} - Gracias ${clienteInfo.nombre}`,
          "success"
      );
    } else {
      mostrarMensaje("Error al procesar la compra", "error");
    }
  };

  return (
      <View style={styles.container}>
        <ToastPersonalizado
            visible={toast.visible}
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
        />

        <View style={styles.header}>
          <Text style={styles.title}>Catálogo de Productos</Text>

          {/* INFORMACIÓN DEL USUARIO AUTENTICADO */}
          <View style={styles.userInfo}>
            <Text style={styles.userText}>
              👤 Comprando como: {user?.email}
            </Text>
            <View style={styles.rolBadge}>
              <Text style={styles.rolText}>
                {rol === 'admin' ? '👑 Admin' : '🛍️ Cliente'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
            style={styles.carritoBtn}
            onPress={() => setShowCarrito(!showCarrito)}
        >
          <Text style={styles.carritoBtnText}>
            🛒 Carrito ({carrito.reduce((total, item) => total + item.cantidad, 0)} items) -
            Total: ${calcularSubtotal().toFixed(2)}
          </Text>
        </TouchableOpacity>

        {showCarrito && (
            <CarritoDrawer
                items={carrito}
                onUpdateCantidad={actualizarCantidadCarrito}
                onEliminar={eliminarDelCarrito}
                onComprar={procesarCompra}
                onClose={() => setShowCarrito(false)}
            />
        )}

        {loading ? (
            <Text style={styles.loading}>Cargando productos...</Text>
        ) : (
            <FlatList
                data={productos}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ProductoItem
                        producto={item}
                        onAgregar={agregarAlCarrito}
                        showToast={showToast}
                    />
                )}
                ListEmptyComponent={
                  <Text style={styles.empty}>No hay productos disponibles</Text>
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
  header: {
    marginBottom: 20,
  },
  title: {
    color: "#F1F5F9",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E293B",
    padding: 12,
    borderRadius: 8,
  },
  userText: {
    color: "#F1F5F9",
    fontSize: 14,
  },
  rolBadge: {
    backgroundColor: "#3B82F6",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  rolText: {
    color: "#F1F5F9",
    fontSize: 12,
    fontWeight: "bold",
  },
  carritoBtn: {
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  carritoBtnText: {
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
});