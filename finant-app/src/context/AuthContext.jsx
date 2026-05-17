import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext(null);

/** Claves centralizadas para sessionStorage (la sesión se limpia al cerrar la ventana) */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  NAME:  'name',
  EMAIL: 'email',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, verificar si hay sesión activa en la ventana
    const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    const name  = sessionStorage.getItem(STORAGE_KEYS.NAME);
    const email = sessionStorage.getItem(STORAGE_KEYS.EMAIL);

    if (token && name && email) {
      setUser({ token, name, email });
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    sessionStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    sessionStorage.setItem(STORAGE_KEYS.NAME,  data.name);
    sessionStorage.setItem(STORAGE_KEYS.EMAIL, data.email);
    setUser(data);
  };

  const logout = () => {
    Object.values(STORAGE_KEYS).forEach((key) => sessionStorage.removeItem(key));
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