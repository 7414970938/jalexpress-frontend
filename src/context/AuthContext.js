import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('je_token'));
  const [role, setRole] = useState(() => localStorage.getItem('je_role'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('je_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (newToken, newRole, newUser) => {
    setToken(newToken);
    setRole(newRole);
    setUser(newUser);
    localStorage.setItem('je_token', newToken);
    localStorage.setItem('je_role', newRole);
    localStorage.setItem('je_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem('je_token');
    localStorage.removeItem('je_role');
    localStorage.removeItem('je_user');
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('je_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
