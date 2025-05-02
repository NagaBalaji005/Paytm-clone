import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      
      // Check if token exists without trying to parse it as JSON
      setUser(storedToken ? { token: storedToken } : null);
      setIsAuthenticated(!!storedToken);
      setUsers(userData ? JSON.parse(userData) : null);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      // Reference variables properly within this scope
      const storedToken = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      console.log("Stored user:", storedToken);
      console.log("User data:", userData);
      // Clear potentially corrupted data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);  
  
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setUsers(null);
    navigate('/');
  };

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  return (  
    <AuthContext.Provider value={{ user, logout, setUser, users, setUsers, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;