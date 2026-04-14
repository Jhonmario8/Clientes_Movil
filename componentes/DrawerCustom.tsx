// componentes/CustomDrawer.tsx
import React from "react";
import {
    DrawerContentScrollView,
    DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

const CustomDrawer = (props: any) => {
    const { user, rol, isAdmin } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('✅ Sesión cerrada');
        } catch (error) {
            console.error('❌ Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar sesión');
        }
    };

    return (
        <DrawerContentScrollView {...props} style={styles.container}>
            <View style={styles.userSection}>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.rolBadge}>
                    <Text style={styles.rolText}>
                        {rol === 'admin' ? '👑 Administrador' : '🛍️ Cliente'}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <DrawerItem
                label="🏠 Inicio"
                labelStyle={styles.label}
                onPress={() => props.navigation.navigate("Inicio")}
            />

            <DrawerItem
                label="👥 Clientes"
                labelStyle={styles.label}
                onPress={() => props.navigation.navigate("Clientes")}
            />

            <DrawerItem
                label="🛒 Realizar Compra"
                labelStyle={styles.label}
                onPress={() => props.navigation.navigate("Productos")}
            />

            {/* SOLO VISIBLE PARA ADMIN */}
            {isAdmin && (
                <DrawerItem
                    label="📦 Administrar Productos"
                    labelStyle={styles.label}
                    onPress={() => props.navigation.navigate("AdminProductos")}
                />
            )}

            <View style={styles.divider} />

            <DrawerItem
                label="🚪 Cerrar sesión"
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
    userSection: {
        padding: 20,
        paddingBottom: 10,
    },
    userEmail: {
        color: "#F1F5F9",
        fontSize: 14,
        marginBottom: 8,
    },
    rolBadge: {
        backgroundColor: "#1E293B",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    rolText: {
        color: "#3B82F6",
        fontSize: 12,
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#334155",
        marginVertical: 10,
        marginHorizontal: 20,
    },
    label: {
        color: "#F1F5F9",
        fontSize: 16,
    },
});