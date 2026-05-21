import { createContext, useState, useCallback, useEffect } from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  fetchMe,
  getCachedUser,
} from '../services/authService';
import { getAccessToken } from '../services/api';
import { ROLE_LABELS } from '../utils/constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCachedUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken());
  const [loading, setLoading] = useState(() => !!getAccessToken()); // Loading only if we have a token to verify

  // Rehydrate user on mount if token exists
  useEffect(() => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }

    fetchMe()
      .then((userData) => {
        setUser(userData);
        setIsAuthenticated(true);
      })
      .catch(() => {
        // Token invalid or expired and refresh failed
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (username, password) => {
    const userData = await apiLogin(username, password);
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    role: user?.role || '',
    roleName: user?.role ? (ROLE_LABELS[user.role] || user.role) : '',
    permissions: user?.permissions || [],
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
