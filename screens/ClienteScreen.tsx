import { useState } from "react";
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

export default function ClientScreen() {
  const [clients, setClients] = useState<Client[]>([]);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [fecha, setFecha] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = () => {
    if (!nombre || !apellido || !correo || !fecha) return;

    if (editingId) {
      setClients(prev =>
        prev.map(c =>
          c.id === editingId
            ? { ...c, nombre, apellido, correo, fecha }
            : c
        )
      );
      setEditingId(null);
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        nombre,
        apellido,
        correo,
        fecha,
      };
      setClients(prev => [...prev, newClient]);
    }

    setNombre('');
    setApellido('');
    setCorreo('');
    setFecha('');
    setShowForm(false);
  };

  const handleCancel = () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setFecha('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (client: Client) => {
    setNombre(client.nombre);
    setApellido(client.apellido);
    setCorreo(client.correo);
    setFecha(client.fecha);
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
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

      <FlatList
        data={clients}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ClientItem
            client={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay clientes aún</Text>
        }
      />
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
});