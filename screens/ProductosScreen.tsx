// pantallas/ProductosScreen.tsx
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert
} from "react-native";
import ProductoItem from "../componentes/ProductoItem";
import { Product } from "../modelo/Product";
import { Client } from "../modelo/Cliente";
import CarritoDrawer from "../componentes/CarritoDrawer";
import { Encabezado } from "../modelo/Encabezado";

// Datos de ejemplo para productos
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
  const [carrito, setCarrito] = useState<Array<{producto: Product, cantidad: number}>>([]);
  const [showCarrito, setShowCarrito] = useState(false);

  useEffect(() => {
    if (route.params?.cliente) {
      setClienteSeleccionado(route.params.cliente);
    }
  }, [route.params]);

  const agregarAlCarrito = (producto: Product, cantidad: number) => {
    if (!clienteSeleccionado) {
      Alert.alert(
        "Cliente requerido",
        "Debe seleccionar un cliente primero",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Seleccionar Cliente", onPress: () => navigation.navigate("Clientes") }
        ]
      );
      return;
    }

    setCarrito(prev => {
      const itemExistente = prev.find(item => item.producto.id === producto.id);
      
      if (itemExistente) {
        const nuevaCantidad = itemExistente.cantidad + cantidad;
        if (nuevaCantidad > producto.stock) {
          Alert.alert("Error", "Stock insuficiente");
          return prev;
        }
        
        return prev.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        );
      } else {
        if (cantidad > producto.stock) {
          Alert.alert("Error", "Stock insuficiente");
          return prev;
        }
        return [...prev, { producto, cantidad }];
      }
    });

    Alert.alert("Éxito", `${producto.nombre} agregado al carrito`);
  };

  const actualizarCantidadCarrito = (productoId: string, nuevaCantidad: number) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    if (nuevaCantidad > producto.stock) {
      Alert.alert("Error", "Stock insuficiente");
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
  };

  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(prev => prev.filter(item => item.producto.id !== productoId));
  };

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => 
      total + (item.producto.valorUnitario * item.cantidad), 0
    );
  };

  const procesarCompra = () => {
    console.log("Procesando compra..."); // Debug
    
    if (carrito.length === 0) {
      Alert.alert("Carrito vacío", "Agregue productos al carrito");
      return;
    }

    if (!clienteSeleccionado) {
      Alert.alert("Error", "No hay cliente seleccionado");
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

    console.log("Encabezado creado:", encabezado); // Debug

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
    Alert.alert(
      "✅ ¡Compra Exitosa!",
      `Total pagado: $${total.toFixed(2)}\n\nGracias por su compra, ${clienteSeleccionado.nombre}!`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
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