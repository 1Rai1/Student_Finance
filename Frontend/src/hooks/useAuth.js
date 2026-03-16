// Frontend/src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://192.168.2.13:5000/api';
const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

const api = new Proxy({}, {
  get: (_, method) => async (id, data) => {
    const endpoints = {
      getUsers: ['/user', {}],
      getUser: [`/user/${id}`, {}],
      createUser: ['/user/create', { method: 'POST', body: JSON.stringify(data) }],
      updateUser: [`/user/${id}`, { method: 'PUT', body: JSON.stringify(data) }],
      deleteUser: [`/user/${id}`, { method: 'DELETE' }],
      searchUsers: [`/user/query?${new URLSearchParams(id)}`, {}]
    };
    const [url, options] = endpoints[method] || [];
    if (!url) return;
    
    try {
      const res = await fetch(`${API_BASE}${url}`, { headers: { 'Content-Type': 'application/json' }, ...options });
      return await res.json();
    } catch (error) {
      console.error(`API Error:`, error);
    }
  }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => { 
    AsyncStorage.getItem('user').then(data => {
      if (data) setUser(JSON.parse(data));
      setInitializing(false);
    }).catch(console.error);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = (await api.getUsers()) || {};
      const foundUser = data?.find(u => u.email === email);
      
      if (!foundUser) return { success: false, message: 'User not found' };
      if (foundUser.password !== password) return { success: false, message: 'Invalid password' };

      const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email, monthlyBudget: foundUser.monthlyBudget || 1500, role: foundUser.role || 'user' };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch {
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = (await api.getUsers()) || {};
      if (data?.some(u => u.email === userData.email)) return { success: false, message: 'Email exists' };
      
      const result = await api.createUser({ name: userData.username, email: userData.email, password: userData.password, role: 'user', monthlyBudget: 1500 });
      return { success: result?.success, message: result?.success ? 'Account created' : 'Registration failed' };
    } catch {
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, initializing, login, register, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};