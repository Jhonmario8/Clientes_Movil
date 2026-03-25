import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Splash from "./screens/splash";
import Login from "./screens/login";
import Registro from "./screens/registro";
import Home from "./screens/home";
import Cliente from "./screens/ClienteScreen";
import CustomDrawer from "./componentes/DrawerCustom";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerMenu() {
  return (
   <Drawer.Navigator
  drawerContent={(props) => <CustomDrawer {...props} />}
  screenOptions={{
    headerShown: false,
    drawerType: "permanent", // 👈 ESTA ES LA CLAVE
    drawerStyle: {
      width: 240,
      backgroundColor: "#0F172A",
    },
  }}
>
      <Drawer.Screen name="Inicio" component={Home} />
      <Drawer.Screen name="Clientes" component={Cliente} />
      <Drawer.Screen name="Reportes" component={Home} />
      <Drawer.Screen name="Ajustes" component={Home} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Home" component={DrawerMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}