import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet } from "react-native";

const CustomDrawer = (props: any) => {

  const handleLogout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    props.navigation.replace("Login");
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <Text style={styles.title}>Menú</Text>

      <DrawerItem
        label="Inicio"
        labelStyle={styles.label}
        onPress={() => props.navigation.navigate("Inicio")}
      />

      <DrawerItem
        label="Clientes"
        labelStyle={styles.label}
        onPress={() => props.navigation.navigate("Clientes")}
      />


      <DrawerItem
        label="Cerrar sesión"
        labelStyle={{ color: "#ef4444", fontWeight: "bold" }}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F172A",
  },
  title: {
    color: "#F1F5F9",
    fontSize: 22,
    fontWeight: "bold",
    margin: 20,
  },
  label: {
    color: "#F1F5F9",
    fontSize: 16,
  },
});