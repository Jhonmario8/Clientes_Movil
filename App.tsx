import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from "react-native";

import Splash from "./screens/splash";
import Login from "./screens/login";
import Registro from "./screens/registro";
import Home from "./screens/home";
import Cliente from "./screens/ClienteScreen";
import CustomDrawer from "./componentes/DrawerCustom";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerMenu() {
  const { width } = useWindowDimensions();

 
  const isLargeScreen = width >= 768;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: !isLargeScreen, 
        drawerType: isLargeScreen ? "permanent" : "front", 
        drawerStyle: {
          width: isLargeScreen ? 240 : 220,
          backgroundColor: "#0F172A",
        },
        overlayColor: "rgba(0,0,0,0.5)", 
      }}
    >
      <Drawer.Screen name="Inicio" component={Home} />
      <Drawer.Screen name="Clientes" component={Cliente} />
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