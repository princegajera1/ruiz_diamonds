import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rulzUser') || sessionStorage.getItem('rulzUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem('rulzUser');
      sessionStorage.removeItem('rulzUser');
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const login = async (email, password, remember = false) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        if (remember) {
          localStorage.setItem('rulzUser', JSON.stringify(data));
        } else {
          sessionStorage.setItem('rulzUser', JSON.stringify(data));
        }
        return { success: true, ...data };
      } else {
        return { success: false, message: data.error || 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Server error. Is the backend running?' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data);
        return { success: true, ...data };
      } else {
        return { success: false, message: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, message: 'Server error. Is the backend running?' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, users, fetchUsers, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
