import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { authenticated_user, logout } from './endpoin';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch authenticated user
  const getAuthenticatedUser = async () => {
    try {
      const userData = await authenticated_user();
      setUser(userData);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  // Logout function
  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };



  // Fetch user on mount
  useEffect(() => {
    getAuthenticatedUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logoutUser, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
