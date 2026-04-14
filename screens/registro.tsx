// pantallas/Registro.tsx
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { saveUsuario } from "../services/firebaseService";

const Registro = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<'admin' | 'cliente'>('cliente');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!emailRegex.test(email)) {
      setError("Ingrese un correo válido");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener: 8+ caracteres, una mayúscula, un número y un símbolo");
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Registrando usuario:', email, 'con rol:', rol);

      // 1. Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Guardar usuario con rol en Firestore
      await saveUsuario(user.uid, email, rol);

      console.log('✅ Usuario registrado exitosamente');
      alert(`¡Registro exitoso como ${rol}! Ahora puedes iniciar sesión`);
      navigation.navigate("Login");

    } catch (err: any) {
      console.error('❌ Error de registro:', err.code, err.message);

      switch (err.code) {
        case 'auth/email-already-in-use':
          setError("Este correo ya está registrado");
          break;
        case 'auth/invalid-email':
          setError("Correo electrónico inválido");
          break;
        case 'auth/weak-password':
          setError("La contraseña es muy débil");
          break;
        default:
          setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
        />

        <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
        />

        <Text style={styles.passwordHint}>
          Mínimo 8 caracteres, una mayúscula, un número y un símbolo
        </Text>

        {/* SELECTOR DE ROL */}
        <Text style={styles.rolLabel}>Tipo de cuenta:</Text>
        <View style={styles.rolContainer}>
          <TouchableOpacity
              style={[
                styles.rolButton,
                rol === 'cliente' && styles.rolButtonActive
              ]}
              onPress={() => setRol('cliente')}
          >
            <Text style={[
              styles.rolButtonText,
              rol === 'cliente' && styles.rolButtonTextActive
            ]}>
              🛍️ Cliente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[
                styles.rolButton,
                rol === 'admin' && styles.rolButtonActive
              ]}
              onPress={() => setRol('admin')}
          >
            <Text style={[
              styles.rolButtonText,
              rol === 'admin' && styles.rolButtonTextActive
            ]}>
              👑 Administrador
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rolDescription}>
          {rol === 'admin'
              ? 'Los administradores pueden gestionar clientes y productos'
              : 'Los clientes pueden realizar compras'}
        </Text>

        <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
        >
          {loading ? (
              <ActivityIndicator color="#FFFFFF" />
          ) : (
              <Text style={styles.buttonText}>Registrar</Text>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
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
    fontSize: 32,
    color: "#F1F5F9",
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#1E293B",
    color: "#F1F5F9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#334155",
  },
  passwordHint: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 20,
    textAlign: "left",
    width: "100%",
  },
  rolLabel: {
    color: "#F1F5F9",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    width: "100%",
  },
  rolContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    width: "100%",
  },
  rolButton: {
    flex: 1,
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#334155",
  },
  rolButtonActive: {
    borderColor: "#3B82F6",
    backgroundColor: "#1E3A5F",
  },
  rolButtonText: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "bold",
  },
  rolButtonTextActive: {
    color: "#F1F5F9",
  },
  rolDescription: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 20,
    width: "100%",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#6B7280",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#3B82F6",
    fontWeight: "bold",
    marginTop: 20,
  },
  error: {
    color: "#ef4444",
    marginTop: 10,
    textAlign: "center",
  },
});

export default Registro;