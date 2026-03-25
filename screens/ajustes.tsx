import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Ajustes = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>
      <Text style={styles.message}>Esta funcionalidad estará disponible próximamente.</Text>
    </View>
  );
};

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
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
  },
});

export default Ajustes;