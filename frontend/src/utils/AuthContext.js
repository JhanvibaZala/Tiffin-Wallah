import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getUserProfile } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Initialize - Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const res = await getUserProfile();
          setUser(res.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await registerUser(userData);
      
      localStorage.setItem('token', res.data.user.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      // Redirect based on role
      if (res.data.user.role === 'customer') {
        navigate('/dashboard/customer');
      } else {
        navigate('/dashboard/provider');
      }
      
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await loginUser({ email, password });
      
      localStorage.setItem('token', res.data.user.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      // Redirect based on role
      if (res.data.user.role === 'customer') {
        navigate('/dashboard/customer');
      } else {
        navigate('/dashboard/provider');
      }
      
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Login failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 