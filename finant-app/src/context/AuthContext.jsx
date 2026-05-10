import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext(null);

/** Claves centralizadas para localStorage */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  NAME:  'name',
  EMAIL: 'email',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, verificar si hay sesión guardada
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const name  = localStorage.getItem(STORAGE_KEYS.NAME);
    const email = localStorage.getItem(STORAGE_KEYS.EMAIL);

    if (token && name && email) {
      setUser({ token, name, email });
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.NAME,  data.name);
    localStorage.setItem(STORAGE_KEYS.EMAIL, data.email);
    setUser(data);
  };

  const logout = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout, loading }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}