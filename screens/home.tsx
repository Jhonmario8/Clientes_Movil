// pantallas/Home.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Home = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Clientes Móvil</Text>
      <Text style={styles.subtitle}>
        Sistema de Gestión de Clientes y Productos
      </Text>

      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate("Clientes")}
        >
          <Text style={styles.menuButtonText}>👥 Gestionar Clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuButton, styles.productosButton]}
          onPress={() => navigation.navigate("Productos")}
        >
          <Text style={styles.menuButtonText}>🛍️ Ver Productos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#F1F5F9",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    marginBottom: 40,
    textAlign: "center",
  },
  menuContainer: {
    width: "100%",
    gap: 15,
  },
  menuButton: {
    backgroundColor: "#3B82F6",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  productosButton: {
    backgroundColor: "#10B981",
  },
  menuButtonText: {
    color: "#F1F5F9",
    fontSize: 18,
    fontWeight: "bold",
  },
});