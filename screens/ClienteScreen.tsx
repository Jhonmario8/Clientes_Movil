// pantallas/ClientScreen.tsx
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert
} from "react-native";
import ClientForm from "../componentes/ClienteForm";
import ClientItem from "../componentes/ClienteItem";
import { Client } from "../modelo/Cliente";
import { getClientes, saveCliente, deleteCliente } from "../services/firebaseService";
import { useAuth } from "../context/AuthContext";

export default function ClientScreen({ navigation }: any) {
  const { isAdmin } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [fecha, setFecha] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    console.log('🔄 Cargando clientes...');
    setLoading(true);
    const clientesDB = await getClientes();
    console.log('📊 Clientes cargados:', clientesDB.length);
    setClients(clientesDB);
    setLoading(false);
  };

  // pantallas/ClientScreen.tsx

  const handleSave = async () => {
    if (!isAdmin) {
      Alert.alert("Acceso denegado", "Solo los administradores pueden modificar clientes");
      return;
    }

    if (!nombre || !apellido || !correo || !fecha) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    // ✅ SOLO PASAR ID SI ESTÁS EDITANDO
    const client: any = {
      nombre,
      apellido,
      correo,
      fecha,
    };

    // Solo agregar ID si estamos editando
    if (editingId) {
      client.id = editingId;
    }

    console.log('💾 Guardando cliente:', client);
    const success = await saveCliente(client);

    if (success) {
      await cargarClientes();
      limpiarFormulario();
      Alert.alert("Éxito", editingId ? "Cliente actualizado" : "Cliente creado");
    } else {
      Alert.alert("Error", "No se pudo guardar el cliente");
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setFecha('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    limpiarFormulario();
  };

  const handleEdit = (client: Client) => {
    if (!isAdmin) {
      Alert.alert("Acceso denegado", "Solo los administradores pueden editar clientes");
      return;
    }

    console.log('✏️ Editando cliente:', client.nombre);
    setNombre(client.nombre);
    setApellido(client.apellido);
    setCorreo(client.correo);
    setFecha(client.fecha);
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDelete = (id: string, nombre: string) => {
    console.log('🗑️ handleDelete llamado - ID:', id, 'Nombre:', nombre);

    if (!isAdmin) {
      Alert.alert("Acceso denegado", "Solo los administradores pueden eliminar clientes");
      return;
    }

    Alert.alert(
        "Confirmar eliminación",
        `¿Estás seguro de eliminar a "${nombre}"?`,
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              console.log('✅ Confirmado - Eliminando cliente con ID:', id);
              const success = await deleteCliente(id);
              console.log('Resultado de deleteCliente:', success);

              if (success) {
                await cargarClientes();
                Alert.alert("Éxito", "Cliente eliminado");
              } else {
                Alert.alert("Error", "No se pudo eliminar el cliente");
              }
            }
          }
        ]
    );
  };

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Clientes</Text>
          {!isAdmin && (
              <View style={styles.clienteBadge}>
                <Text style={styles.clienteBadgeText}>Modo Cliente - Solo lectura</Text>
              </View>
          )}
        </View>

        {!showForm && isAdmin && (
            <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
              <Text style={styles.addButtonText}>➕ Agregar Nuevo Cliente</Text>
            </TouchableOpacity>
        )}

        {showForm && isAdmin && (
            <ClientForm
                nombre={nombre}
                apellido={apellido}
                correo={correo}
                fecha={fecha}
                setNombre={setNombre}
                setApellido={setApellido}
                setCorreo={setCorreo}
                setFecha={setFecha}
                onSave={handleSave}
                editing={!!editingId}
                onCancel={handleCancel}
            />
        )}

        {loading ? (
            <Text style={styles.loading}>Cargando clientes...</Text>
        ) : (
            <FlatList
                data={clients}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ClientItem
                        client={item}
                        onEdit={isAdmin ? () => handleEdit(item) : undefined}
                        onDelete={isAdmin ? () => handleDelete(item.id, item.nombre) : undefined}  // ← ¡CORREGIDO!
                        showAdminControls={isAdmin}
                    />
                )}
                ListEmptyComponent={
                  <Text style={styles.empty}>No hay clientes registrados</Text>
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
    marginBottom: 15,
  },
  title: {
    color: "#F1F5F9",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  clienteBadge: {
    backgroundColor: "#1E293B",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  clienteBadgeText: {
    color: "#94A3B8",
    fontSize: 12,
  },
  addButton: {
    backgroundColor: "#10B981",
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
});