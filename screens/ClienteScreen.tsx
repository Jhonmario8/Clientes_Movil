// pantallas/ClientScreen.tsx
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import ClientForm from "../componentes/ClienteForm";
import ClientItem from "../componentes/ClienteItem";
import { Client } from "../modelo/Cliente";
import { getClientes, saveCliente, deleteCliente } from "../modelo/database/DatabaseService";

export default function ClientScreen({ navigation }: any) {
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

  // ✅ CORREGIDO: Agregar async/await
  const cargarClientes = async () => {
    console.log('🔄 Cargando clientes...');
    setLoading(true);
    const clientesDB = await getClientes();  // ← AGREGAR await
    console.log('📊 Clientes cargados:', clientesDB.length);
    setClients(clientesDB);
    setLoading(false);
  };

  // ✅ CORREGIDO: Agregar async/await
  const handleSave = async () => {
    if (!nombre || !apellido || !correo || !fecha) {
      console.log('⚠️ Campos incompletos');
      return;
    }

    const client: Client = {
      id: editingId || Date.now().toString(),
      nombre,
      apellido,
      correo,
      fecha,
    };

    console.log('💾 Guardando cliente:', client.nombre);
    const success = await saveCliente(client);  // ← AGREGAR await
    
    if (success) {
      await cargarClientes();  // ← AGREGAR await
      limpiarFormulario();
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
    setNombre(client.nombre);
    setApellido(client.apellido);
    setCorreo(client.correo);
    setFecha(client.fecha);
    setEditingId(client.id);
    setShowForm(true);
  };

  // ✅ CORREGIDO: Agregar async/await
  const handleDelete = async (id: string) => {
    console.log('🗑️ Eliminando cliente:', id);
    const success = await deleteCliente(id);  // ← AGREGAR await
    if (success) {
      await cargarClientes();  // ← AGREGAR await
    }
  };

  const handleSelectClient = (client: Client) => {
    navigation.navigate("Productos", { cliente: client });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>

      {!showForm && (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
          <Text style={styles.addButtonText}>Agregar Nuevo Cliente</Text>
        </TouchableOpacity>
      )}

      {showForm && (
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
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id)}
              onSelect={() => handleSelectClient(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay clientes aún</Text>
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
  title: {
    color: "#F1F5F9",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#10B981",
    padding: 12,
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