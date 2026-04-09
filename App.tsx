// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import Splash from "./screens/splash";
import Login from "./screens/login";
import Registro from "./screens/registro";
import Home from "./screens/home";
import ClientScreen from "./screens/ClienteScreen";
import ProductosScreen from "./screens/ProductosScreen";
import CustomDrawer from "./componentes/DrawerCustom";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0F172A",
        },
        headerTintColor: "#F1F5F9",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerStyle: {
          backgroundColor: "#0F172A",
        },
      }}
    >
      <Drawer.Screen name="Inicio" component={Home} />
      <Drawer.Screen name="Clientes" component={ClientScreen} />
      <Drawer.Screen name="Productos" component={ProductosScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Home" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}