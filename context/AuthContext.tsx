// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserRole } from '../services/firebaseService';

interface AuthContextType {
  user: any;
  rol: 'admin' | 'cliente' | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  rol: null,
  loading: true,
  isAdmin: false
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [rol, setRol] = useState<'admin' | 'cliente' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const userRole = await getUserRole(user.uid);
        setRol(userRole);
        console.log('👤 Usuario autenticado:', user.email, 'Rol:', userRole);
      } else {
        setRol(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    rol,
    loading,
    isAdmin: rol === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);