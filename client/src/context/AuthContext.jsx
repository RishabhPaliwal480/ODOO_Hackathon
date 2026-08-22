import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, getStoredUser, getToken, removeStoredUser, removeToken, setStoredUser, setToken } from '../services';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
  authModalOpen: false,
  authModalMode: 'login',
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const restoreSession = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.me();
      if (res.user) {
        setUser(res.user);
        setStoredUser(res.user);
      }
    } catch {
      // Token expired or invalid
      removeToken();
      removeStoredUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.token && res.user) {
      setToken(res.token);
      setStoredUser(res.user);
      setUser(res.user);
      setAuthModalOpen(false);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.token && res.user) {
      setToken(res.token);
      setStoredUser(res.user);
      setUser(res.user);
      setAuthModalOpen(false);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    removeToken();
    removeStoredUser();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    setStoredUser(updatedUser);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateUser,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
