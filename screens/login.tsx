// pantallas/Login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }: any) => {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const usuario = {
    email: "jhonma@gmail.com",
    password: "Jhonma12.",
  };

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
      setSuccess(false);
      setError("Ingrese un correo valido");
      return
    }

    if (email === usuario.email && password === usuario.password) {
      setError("");
      setSuccess(true);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      navigation.replace("Home");
    } else {
      setSuccess(false);
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.footer}>
        ¿No tienes cuenta?{" "}
        <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
          <Text style={styles.link}>Regístrate</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: "#F1F5F9",
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1E293B",
    color: "#F1F5F9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: "#334155",
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    color: "#94A3B8",
    marginTop: 20,
    textAlign: "center",
  },
  link: {
    color: "#3B82F6",
    fontWeight: "bold",
  },
  error: {
    color: "#ef4444",
    marginTop: 10,
    textAlign: "center",
  },
  success: {
    color: "#22c55e",
    marginTop: 10,
    textAlign: "center",
  },
});