// Frontend/src/hooks/useGoals.js
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';

const GoalsContext = createContext({});
export const useGoals = () => useContext(GoalsContext);

const API = 'http://192.168.2.13:5000/api';

const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    
    if (res.status === 404) {
      return { success: true, data: [] };
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Request error:', error);
    return { success: false, data: [] };
  }
};

const api = {
  getUserGoals: (uid) => request(`/goal/user/${uid}`),
  create: (uid, data) => request(`/goal/user/${uid}`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/goal/${id}`, { method: 'DELETE' }),
  addProgress: (id, amount) => {
    // Clean the ID - remove any whitespace or hidden characters
    const cleanId = id?.toString().trim();
    console.log('API call - Original ID:', id, 'Cleaned ID:', cleanId);
    
    return request(`/goal/${cleanId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ amount: parseFloat(amount) })
    });
  },
};

export const GoalsProvider = ({ children }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGoals = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.getUserGoals(user.id);
      setGoals(res?.data || []);
    } catch (error) {
      console.error('Fetch goals error:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createGoal = useCallback(async (data) => {
    if (!user?.id) {
      Alert.alert('Error', 'Not authenticated');
      return false;
    }
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description || '',
        targetAmount: parseFloat(data.targetAmount),
        currentAmount: 0,
        deadline: data.deadline || null,
        category: data.category || 'general'
      };
      
      const res = await api.create(user.id, payload);
      
      if (res?.success) {
        await fetchGoals();
        Alert.alert('Success', 'Goal created');
        return true;
      } else {
        Alert.alert('Error', res?.message || 'Failed to create goal');
        return false;
      }
    } catch (error) {
      console.error('Create goal error:', error);
      Alert.alert('Error', 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchGoals]);

  const addProgress = useCallback(async (goalId, amount) => {
    // Clean the goal ID
    const cleanGoalId = goalId?.toString().trim();
    
    console.log('addProgress called with:', { 
      originalGoalId: goalId, 
      cleanGoalId: cleanGoalId,
      amount: amount 
    });

    if (!cleanGoalId) {
      console.error('No goal ID provided');
      Alert.alert('Error', 'Goal not found');
      return false;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }

    setLoading(true);
    try {
      console.log('Calling API with:', { goalId: cleanGoalId, amount: numAmount });
      
      const res = await api.addProgress(cleanGoalId, numAmount);
      console.log('API response:', res);
      
      if (res?.success) {
        await fetchGoals();
        Alert.alert('Success', 'Savings added!');
        return true;
      } else {
        Alert.alert('Error', res?.message || 'Failed to add savings');
        return false;
      }
    } catch (error) {
      console.error('Add progress error:', error);
      Alert.alert('Error', 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchGoals]);

  const deleteGoal = useCallback(async (goalId) => {
    const cleanGoalId = goalId?.toString().trim();
    
    if (!cleanGoalId) {
      Alert.alert('Error', 'Goal not found');
      return false;
    }

    setLoading(true);
    try {
      const res = await api.delete(cleanGoalId);
      if (res?.success) {
        setGoals(prev => prev.filter(g => g.id !== cleanGoalId));
        Alert.alert('Success', 'Goal deleted');
        return true;
      } else {
        Alert.alert('Error', res?.message || 'Failed to delete');
        return false;
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) fetchGoals();
  }, [user?.id, fetchGoals]);

  const value = {
    goals,
    loading,
    fetchGoals,
    createGoal,
    addProgress,
    deleteGoal,
    api
  };

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};