import { createContext, useState, useCallback } from 'react';
import mockUsers from '../data/mockUsers';
import { ROLES, ROLE_LABELS } from '../utils/constants';

export const AuthContext = createContext(null);

const DEFAULT_USER = mockUsers[0]; // Admin by default

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Auto-logged in for dev

  const login = useCallback((username, password) => {
    const found = mockUsers.find(u => u.username === username);
    if (found) {
      setUser(found);
      setIsAuthenticated(true);
      return { success: true, user: found };
    }
    return { success: false, error: 'Invalid credentials' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const switchRole = useCallback((role) => {
    const found = mockUsers.find(u => u.role === role);
    if (found) {
      setUser(found);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    switchRole,
    role: user?.role,
    roleName: user ? ROLE_LABELS[user.role] : '',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
