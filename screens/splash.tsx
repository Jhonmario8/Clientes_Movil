import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({ navigation }: any) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation.replace('Login');
      }
    };

    // Simular un pequeño delay para mostrar el splash
    setTimeout(checkLoginStatus, 1000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes Móvil</Text>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#F1F5F9",
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  loadingText: {
    color: "#94A3B8",
    marginTop: 20,
    fontSize: 16,
  },
});

export default Splash;