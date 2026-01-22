import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';
import { initSocket, disconnectSocket } from '../sockets/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Récupérer les infos utilisateur
      api.get('/users/me/')
        .then((response) => {
          setUser(response.data);
          initSocket(); // Connecter au WebSocket
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Connexion
  const login = async (username, password) => {
    try {
      const response = await api.post('/token/', { username, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Récupérer les infos utilisateur
      const userResponse = await api.get('/users/me/');
      setUser(userResponse.data);
      
      // Connecter au WebSocket
      initSocket();
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Erreur de connexion' 
      };
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    disconnectSocket();
  };

  // Inscription
  const register = async (userData) => {
    try {
      await api.post('/users/register/', userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Erreur lors de l\'inscription' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};