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
  };

  const handleEdit = (client: Client) => {
    setNombre(client.nombre);
    setApellido(client.apellido);
    setCorreo(client.correo);
    setFecha(client.fecha);
    setEditingId(client.id);
  };

  const handleDelete = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Clientes</Text>

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
      />

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
  empty: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 20,
  },
});