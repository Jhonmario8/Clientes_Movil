// App.tsx
import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Splash from "./screens/splash";
import Login from "./screens/login";
import Registro from "./screens/registro";
import Home from "./screens/home";
import ClientScreen from "./screens/ClienteScreen";
import ProductosScreen from "./screens/ProductosScreen";
import AdminProductosScreen from "./screens/AdminProductosScreen";
import CustomDrawer from "./componentes/DrawerCustom";


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
    const { isAdmin } = useAuth();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: "#0F172A" },
                headerTintColor: "#F1F5F9",
                drawerStyle: { backgroundColor: "#0F172A" },
            }}
        >
            <Drawer.Screen name="Inicio" component={Home} />
            <Drawer.Screen name="Clientes" component={ClientScreen} />
            <Drawer.Screen name="Productos" component={ProductosScreen} />

            {/* SOLO VISIBLE PARA ADMIN */}
            {isAdmin && (
                <Drawer.Screen name="AdminProductos" component={AdminProductosScreen} />
            )}
        </Drawer.Navigator>
    );
}

function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return <Splash />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Home" component={DrawerNavigator} />
                ) : (
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Registro" component={Registro} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}