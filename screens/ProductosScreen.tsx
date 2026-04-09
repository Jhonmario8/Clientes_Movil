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
import { Client } from "../modelo/Cliente";
import CarritoDrawer from "../componentes/CarritoDrawer";
import { Encabezado } from "../modelo/Encabezado";
import ToastPersonalizado from "../componentes/ToastPersonalizado";
import { useToast } from "../componentes/useToast";

const productosIniciales: Product[] = [
  {
    id: "1",
    nombre: "Laptop HP",
    descripcion: "8GB RAM, 512GB SSD",
    valorUnitario: 850.00,
    stock: 10
  },
  {
    id: "2",
    nombre: "Mouse Inalámbrico",
    descripcion: "Ergonómico, 2.4GHz",
    valorUnitario: 25.50,
    stock: 50
  },
  {
    id: "3",
    nombre: "Teclado Mecánico",
    descripcion: "RGB, Switches Blue",
    valorUnitario: 75.99,
    stock: 30
  },
  {
    id: "4",
    nombre: "Monitor 24\"",
    descripcion: "Full HD, 75Hz",
    valorUnitario: 180.00,
    stock: 15
  },
  {
    id: "5",
    nombre: "Auriculares USB",
    descripcion: "Con micrófono, sonido envolvente",
    valorUnitario: 45.50,
    stock: 25
  }
];

interface ProductosScreenProps {
  navigation: any;
  route: any;
}

export default function ProductosScreen({ navigation, route }: ProductosScreenProps) {
  const [productos, setProductos] = useState<Product[]>(productosIniciales);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Client | null>(null);
  const [carrito, setCarrito] = useState<Array<{ producto: Product, cantidad: number }>>([]);
  const [showCarrito, setShowCarrito] = useState(false);

  // Usar el hook de toast
  const { toast, showToast, hideToast } = useToast();

  // Función helper para mostrar mensajes (funciona en web y móvil)
  const mostrarMensaje = (mensaje: string, tipo: "success" | "error" | "info" | "warning" = "info") => {
    if (Platform.OS === 'web') {
      // En web, usar el toast personalizado
      showToast(mensaje, tipo);
    } else {
      // En móvil, usar Alert.alert
      Alert.alert(tipo === "success" ? "Éxito" : tipo === "error" ? "Error" : "Información", mensaje);
    }
  };

  useEffect(() => {
    if (route.params?.cliente) {
      setClienteSeleccionado(route.params.cliente);
      mostrarMensaje(`Cliente seleccionado: ${route.params.cliente.nombre}`, "success");
    }
  }, [route.params]);

  const agregarAlCarrito = (producto: Product, cantidad: number) => {
    // Validar cliente
    if (!clienteSeleccionado) {
      mostrarMensaje("Debe seleccionar un cliente primero", "warning");

      // Para web, también podemos mostrar un diálogo de confirmación
      if (Platform.OS === 'web' && window.confirm("¿Desea ir a seleccionar un cliente?")) {
        navigation.navigate("Clientes");
      }
      return;
    }

    // Buscar si ya existe en el carrito
    const itemExistente = carrito.find(item => item.producto.id === producto.id);

    // Validar stock
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

    // Actualizar carrito
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

    // Validar stock
    if (nuevaCantidad > producto.stock) {
      mostrarMensaje(`Stock insuficiente. Máximo disponible: ${producto.stock}`, "error");
      return;
    }

    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    // Actualizar el estado
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

  const procesarCompra = () => {
    console.log("🛒 Procesando compra...");

    // Validaciones
    if (carrito.length === 0) {
      mostrarMensaje("Agregue productos al carrito antes de comprar", "warning");
      return;
    }

    if (!clienteSeleccionado) {
      mostrarMensaje("No hay cliente seleccionado", "error");
      return;
    }

    const subTotal = calcularSubtotal();
    const descuento = subTotal > 100 ? subTotal * 0.10 : 0;
    const total = subTotal - descuento;

    // Crear encabezado
    const encabezado: Encabezado = {
      id: Date.now().toString(),
      idCliente: clienteSeleccionado.id,
      fecha: new Date().toISOString().split('T')[0],
      subTotal,
      descuentoTotal: descuento,
      total
    };

    console.log("✅ Compra registrada:", encabezado);

    // Actualizar stock
    setProductos(prev =>
      prev.map(producto => {
        const itemCarrito = carrito.find(item => item.producto.id === producto.id);
        if (itemCarrito) {
          return {
            ...producto,
            stock: producto.stock - itemCarrito.cantidad
          };
        }
        return producto;
      })
    );

    // Limpiar carrito y cerrar
    setCarrito([]);
    setShowCarrito(false);

    // Mostrar mensaje de éxito
    mostrarMensaje(
      `¡Compra exitosa! Total: $${total.toFixed(2)} - Gracias ${clienteSeleccionado.nombre}`,
      "success"
    );
  };

  return (
    <View style={styles.container}>
      {/* Toast Personalizado para notificaciones */}
      <ToastPersonalizado
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Catálogo de Productos</Text>
        {clienteSeleccionado && (
          <View style={styles.clienteInfo}>
            <Text style={styles.clienteText}>
              Cliente: {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Clientes")}>
              <Text style={styles.cambiarCliente}>Cambiar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!clienteSeleccionado ? (
        <View style={styles.noClienteContainer}>
          <Text style={styles.noClienteText}>
            Seleccione un cliente para continuar
          </Text>
          <TouchableOpacity
            style={styles.seleccionarClienteBtn}
            onPress={() => navigation.navigate("Clientes")}
          >
            <Text style={styles.seleccionarClienteText}>Ir a Clientes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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

          <FlatList
            data={productos}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ProductoItem
                producto={item}
                onAgregar={agregarAlCarrito}
                showToast={showToast}  // ← OBLIGATORIO ahora
              />
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No hay productos disponibles</Text>
            }
          />
        </>
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
  clienteInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E293B",
    padding: 10,
    borderRadius: 8,
  },
  clienteText: {
    color: "#F1F5F9",
    fontSize: 14,
  },
  cambiarCliente: {
    color: "#3B82F6",
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
  noClienteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noClienteText: {
    color: "#94A3B8",
    fontSize: 16,
    marginBottom: 20,
  },
  seleccionarClienteBtn: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 8,
  },
  seleccionarClienteText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
  empty: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 20,
  },
});