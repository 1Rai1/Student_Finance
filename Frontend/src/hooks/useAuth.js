import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE, { FIREBASE_CONFIG } from '../config';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

const { apiKey } = FIREBASE_CONFIG;

const exchangeCustomToken = async (customToken) => {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });
  const data = await res.json();
  if (!data.idToken) throw new Error(data.error?.message || 'Exchange failed');
  return { idToken: data.idToken, refreshToken: data.refreshToken };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const idToken = await AsyncStorage.getItem('idToken');
        const storedUser = await AsyncStorage.getItem('user');
        if (idToken && storedUser) {
          const userInfo = JSON.parse(storedUser);
          userInfo.idToken = idToken;
          setUser(userInfo);
        }
      } catch (e) {}
      setInitializing(false);
    };
    restore();
  }, []);

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.username
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const { idToken } = await exchangeCustomToken(data.data.customToken);

      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      const meData = await meRes.json();
      if (!meData.success) throw new Error('Failed to fetch user');

      const userInfo = {
        uid: meData.data.uid,
        email: userData.email,
        name: meData.data.name,
        role: meData.data.role,
        monthlyBudget: meData.data.monthlyBudget || 1500,
        idToken
      };
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));
      await AsyncStorage.setItem('idToken', idToken);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const tokenRes = await fetch(`${API_BASE}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.success) throw new Error(tokenData.message);

      const { idToken } = await exchangeCustomToken(tokenData.data.customToken);

      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      const meData = await meRes.json();
      if (!meData.success) throw new Error('Failed to fetch user');

      const userInfo = {
        uid: meData.data.uid,
        email: meData.data.email,
        name: meData.data.name,
        role: meData.data.role,
        monthlyBudget: meData.data.monthlyBudget || 1500,
        idToken
      };
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));
      await AsyncStorage.setItem('idToken', idToken);
      setUser(userInfo);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['user', 'idToken']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};