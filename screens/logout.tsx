import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({ navigation }: any) => {
  useEffect(() => {
    const performLogout = async () => {
      await AsyncStorage.removeItem('isLoggedIn');
      navigation.replace('Login');
    };

    performLogout();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cerrando sesión...</Text>
      <ActivityIndicator size="large" color="#3B82F6" />
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
    fontSize: 24,
    color: "#F1F5F9",
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default Logout;