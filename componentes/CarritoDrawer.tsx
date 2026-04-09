// componentes/CarritoDrawer.tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert
} from "react-native";
import { Product } from "../modelo/Product";
import { useState } from "react";

interface CarritoDrawerProps {
  items: Array<{producto: Product, cantidad: number}>;
  onUpdateCantidad: (productoId: string, cantidad: number) => void;
  onEliminar: (productoId: string) => void;
  onComprar: () => void;
  onClose: () => void;
}

export default function CarritoDrawer({
  items,
  onUpdateCantidad,
  onEliminar,
  onComprar,
  onClose
}: CarritoDrawerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempCantidad, setTempCantidad] = useState("");
  const [showRecibo, setShowRecibo] = useState(false);

  const calcularSubtotal = () => {
    return items.reduce((total, item) => 
      total + (item.producto.valorUnitario * item.cantidad), 0
    );
  };

  const calcularDescuento = () => {
    const subtotal = calcularSubtotal();
    return subtotal > 100 ? subtotal * 0.10 : 0;
  };

  const calcularTotal = () => {
    return calcularSubtotal() - calcularDescuento();
  };

  const handleUpdateCantidad = (productoId: string) => {
    const cantidad = parseInt(tempCantidad);
    if (!isNaN(cantidad) && cantidad > 0) {
      onUpdateCantidad(productoId, cantidad);
    }
    setEditingId(null);
    setTempCantidad("");
  };

  const handleComprarPress = () => {
    if (items.length === 0) {
      Alert.alert("Carrito vacío", "Agregue productos al carrito");
      return;
    }
    setShowRecibo(true);
  };

  const confirmarCompra = () => {
    setShowRecibo(false);
    onComprar();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Carrito de Compras</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.itemsContainer}>
          {items.length === 0 ? (
            <Text style={styles.emptyText}>El carrito está vacío</Text>
          ) : (
            items.map(({ producto, cantidad }) => (
              <View key={producto.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemNombre}>{producto.nombre}</Text>
                  <Text style={styles.itemPrecio}>
                    ${producto.valorUnitario.toFixed(2)} c/u
                  </Text>
                  <Text style={styles.itemSubtotal}>
                    Subtotal: ${(producto.valorUnitario * cantidad).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.itemActions}>
                  {editingId === producto.id ? (
                    <View style={styles.editContainer}>
                      <TextInput
                        style={styles.cantidadInput}
                        value={tempCantidad}
                        onChangeText={setTempCantidad}
                        keyboardType="numeric"
                        autoFocus
                      />
                      <TouchableOpacity 
                        style={styles.confirmBtn}
                        onPress={() => handleUpdateCantidad(producto.id)}
                      >
                        <Text style={styles.confirmText}>✓</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.cancelBtn}
                        onPress={() => {
                          setEditingId(null);
                          setTempCantidad("");
                        }}
                      >
                        <Text style={styles.cancelText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity 
                        style={styles.cantidadBtn}
                        onPress={() => {
                          setEditingId(producto.id);
                          setTempCantidad(cantidad.toString());
                        }}
                      >
                        <Text style={styles.cantidadText}>{cantidad}</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.eliminarBtn}
                        onPress={() => onEliminar(producto.id)}
                      >
                        <Text style={styles.eliminarText}>🗑️</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {items.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.totalesContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalValue}>
                  ${calcularSubtotal().toFixed(2)}
                </Text>
              </View>
              {calcularDescuento() > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.descuentoLabel}>Descuento (10%):</Text>
                  <Text style={styles.descuentoValue}>
                    -${calcularDescuento().toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={[styles.totalRow, styles.totalFinal]}>
                <Text style={styles.totalFinalLabel}>Total:</Text>
                <Text style={styles.totalFinalValue}>
                  ${calcularTotal().toFixed(2)}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.comprarBtn} 
              onPress={handleComprarPress}
            >
              <Text style={styles.comprarText}>Finalizar Compra</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal de Recibo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRecibo}
        onRequestClose={() => setShowRecibo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reciboContainer}>
            <View style={styles.reciboHeader}>
              <Text style={styles.reciboTitle}>🧾 RECIBO DE COMPRA</Text>
              <TouchableOpacity onPress={() => setShowRecibo(false)}>
                <Text style={styles.reciboClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.reciboContent}>
              <Text style={styles.reciboFecha}>
                Fecha: {new Date().toLocaleDateString()}
              </Text>
              <Text style={styles.reciboHora}>
                Hora: {new Date().toLocaleTimeString()}
              </Text>
              
              <View style={styles.reciboDivider} />
              
              <Text style={styles.reciboSectionTitle}>PRODUCTOS</Text>
              
              {items.map(({ producto, cantidad }) => (
                <View key={producto.id} style={styles.reciboItem}>
                  <View style={styles.reciboItemInfo}>
                    <Text style={styles.reciboItemNombre}>{producto.nombre}</Text>
                    <Text style={styles.reciboItemCantidad}>x{cantidad}</Text>
                  </View>
                  <Text style={styles.reciboItemPrecio}>
                    ${(producto.valorUnitario * cantidad).toFixed(2)}
                  </Text>
                </View>
              ))}
              
              <View style={styles.reciboDivider} />
              
              <View style={styles.reciboTotalRow}>
                <Text style={styles.reciboTotalLabel}>Subtotal:</Text>
                <Text style={styles.reciboTotalValue}>
                  ${calcularSubtotal().toFixed(2)}
                </Text>
              </View>
              
              {calcularDescuento() > 0 && (
                <View style={styles.reciboTotalRow}>
                  <Text style={styles.reciboDescuentoLabel}>Descuento (10%):</Text>
                  <Text style={styles.reciboDescuentoValue}>
                    -${calcularDescuento().toFixed(2)}
                  </Text>
                </View>
              )}
              
              <View style={[styles.reciboTotalRow, styles.reciboTotalFinal]}>
                <Text style={styles.reciboTotalFinalLabel}>TOTAL:</Text>
                <Text style={styles.reciboTotalFinalValue}>
                  ${calcularTotal().toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.reciboDivider} />
              
              <Text style={styles.reciboGracias}>
                ¡Gracias por su compra!
              </Text>
              <Text style={styles.reciboMensaje}>
                Su pedido será procesado a la brevedad
              </Text>
            </ScrollView>

            <View style={styles.reciboActions}>
              <TouchableOpacity 
                style={styles.reciboCancelarBtn}
                onPress={() => setShowRecibo(false)}
              >
                <Text style={styles.reciboCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.reciboConfirmarBtn}
                onPress={confirmarCompra}
              >
                <Text style={styles.reciboConfirmarText}>Confirmar Compra</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    maxHeight: 500,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  title: {
    color: "#F1F5F9",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    color: "#94A3B8",
    fontSize: 20,
    fontWeight: "bold",
  },
  itemsContainer: {
    maxHeight: 300,
  },
  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    padding: 20,
  },
  itemCard: {
    backgroundColor: "#0F172A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemNombre: {
    color: "#F1F5F9",
    fontSize: 14,
    fontWeight: "bold",
  },
  itemPrecio: {
    color: "#10B981",
    fontSize: 12,
    marginTop: 2,
  },
  itemSubtotal: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cantidadBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cantidadText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cantidadInput: {
    backgroundColor: "#1E293B",
    color: "#F1F5F9",
    padding: 5,
    borderRadius: 6,
    width: 50,
    textAlign: "center",
  },
  confirmBtn: {
    backgroundColor: "#22C55E",
    padding: 5,
    borderRadius: 6,
  },
  confirmText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#EF4444",
    padding: 5,
    borderRadius: 6,
  },
  cancelText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
  eliminarBtn: {
    padding: 5,
  },
  eliminarText: {
    fontSize: 16,
  },
  footer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  totalesContainer: {
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    color: "#94A3B8",
  },
  totalValue: {
    color: "#F1F5F9",
  },
  descuentoLabel: {
    color: "#22C55E",
  },
  descuentoValue: {
    color: "#22C55E",
    fontWeight: "bold",
  },
  totalFinal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  totalFinalLabel: {
    color: "#F1F5F9",
    fontSize: 16,
    fontWeight: "bold",
  },
  totalFinalValue: {
    color: "#10B981",
    fontSize: 18,
    fontWeight: "bold",
  },
  comprarBtn: {
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  comprarText: {
    color: "#F1F5F9",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  // Estilos del Modal de Recibo
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  reciboContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    width: "100%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reciboHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  reciboTitle: {
    color: "#F1F5F9",
    fontSize: 20,
    fontWeight: "bold",
  },
  reciboClose: {
    color: "#94A3B8",
    fontSize: 24,
    fontWeight: "bold",
  },
  reciboContent: {
    padding: 20,
  },
  reciboFecha: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 5,
  },
  reciboHora: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 15,
  },
  reciboDivider: {
    height: 1,
    backgroundColor: "#334155",
    marginVertical: 15,
  },
  reciboSectionTitle: {
    color: "#F1F5F9",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reciboItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reciboItemInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reciboItemNombre: {
    color: "#F1F5F9",
    fontSize: 14,
  },
  reciboItemCantidad: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "bold",
  },
  reciboItemPrecio: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "bold",
  },
  reciboTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reciboTotalLabel: {
    color: "#94A3B8",
    fontSize: 14,
  },
  reciboTotalValue: {
    color: "#F1F5F9",
    fontSize: 14,
  },
  reciboDescuentoLabel: {
    color: "#22C55E",
    fontSize: 14,
  },
  reciboDescuentoValue: {
    color: "#22C55E",
    fontSize: 14,
    fontWeight: "bold",
  },
  reciboTotalFinal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  reciboTotalFinalLabel: {
    color: "#F1F5F9",
    fontSize: 18,
    fontWeight: "bold",
  },
  reciboTotalFinalValue: {
    color: "#10B981",
    fontSize: 20,
    fontWeight: "bold",
  },
  reciboGracias: {
    color: "#F1F5F9",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  reciboMensaje: {
    color: "#94A3B8",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  reciboActions: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#334155",
    gap: 10,
  },
  reciboCancelarBtn: {
    flex: 1,
    backgroundColor: "#6B7280",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  reciboCancelarText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
  reciboConfirmarBtn: {
    flex: 1,
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  reciboConfirmarText: {
    color: "#F1F5F9",
    fontWeight: "bold",
  },
});