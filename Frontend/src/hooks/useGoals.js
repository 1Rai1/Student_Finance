import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import API_BASE from '../config';

const GoalsContext = createContext({});
export const useGoals = () => useContext(GoalsContext);

const cleanGoalId = (id) => {
  if (!id) return '';
  return id.toString().trim();
};

const request = async (endpoint, token, options = {}) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (res.status === 404) return { success: true, data: [] };
    return data;
  } catch (error) {
    console.error('Request error:', error);
    return { success: false, data: [] };
  }
};

export const GoalsProvider = ({ children }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGoals = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    const res = await request(`/goal/user/${user.uid}`, user?.idToken);
    if (res?.success) {
      setGoals(res.data || []);
    } else {
      setGoals([]);
    }
    setLoading(false);
  }, [user]);

  const createGoal = useCallback(async (data) => {
    if (!user?.uid) {
      Alert.alert('Error', 'Not authenticated');
      return false;
    }
    setLoading(true);
    const payload = {
      title: data.title,
      description: data.description || '',
      targetAmount: parseFloat(data.targetAmount),
      currentAmount: 0,
      deadline: data.deadline || null,
      category: data.category || 'general'
    };
    const res = await request(`/goal/user/${user.uid}`, user?.idToken, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res?.success) {
      await fetchGoals();
      Alert.alert('Success', 'Goal created');
      return true;
    } else {
      Alert.alert('Error', res?.message || 'Failed to create goal');
      return false;
    }
  }, [user, fetchGoals]);

  const addProgress = useCallback(async (goalId, amount) => {
    const cleanId = cleanGoalId(goalId);
    if (!cleanId) {
      Alert.alert('Error', 'Invalid goal ID');
      return false;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    setLoading(true);
    const res = await request(`/goal/${cleanId}/progress`, user?.idToken, {
      method: 'POST',
      body: JSON.stringify({ amount: numAmount })
    });
    if (res?.success) {
      await fetchGoals();
      Alert.alert('✅ Success', 'Savings added!');
      return true;
    } else {
      Alert.alert('Error', res?.message || 'Failed to add savings');
      return false;
    }
  }, [user, fetchGoals]);

  const deleteGoal = useCallback(async (goalId) => {
    const cleanId = cleanGoalId(goalId);
    if (!cleanId) {
      Alert.alert('Error', 'Goal not found');
      return false;
    }
    setLoading(true);
    const res = await request(`/goal/${cleanId}`, user?.idToken, { method: 'DELETE' });
    if (res?.success) {
      setGoals(prev => prev.filter(g => g.id !== cleanId));
      Alert.alert('Success', 'Goal deleted');
      return true;
    } else {
      Alert.alert('Error', res?.message || 'Failed to delete');
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) fetchGoals();
  }, [user?.uid, fetchGoals]);

  return (
    <GoalsContext.Provider value={{
      goals,
      loading,
      fetchGoals,
      createGoal,
      addProgress,
      deleteGoal
    }}>
      {children}
    </GoalsContext.Provider>
  );
};