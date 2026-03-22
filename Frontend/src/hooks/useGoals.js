import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import API_BASE from '../config';

//context
const GoalsContext = createContext({});
export const useGoals = () => useContext(GoalsContext);

//sanitize ID
const cleanGoalId = (id) => {
  if (!id) return '';
  return id.toString().trim();
};

//fetch helper
const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Request error:', error);
    return { success: false, data: [] };
  }
};

//endpoints
const api = {
  getUserGoals: (uid) => request(`/goal/user/${uid}`),
  create: (uid, data) => request(`/goal/user/${uid}`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  delete: (id) => {
    const cleanId = cleanGoalId(id);
    return request(`/goal/${cleanId}`, { method: 'DELETE' });
  },
  //amount in body
  addProgress: (id, amount) => {
    const cleanId = cleanGoalId(id);
    return request(`/goal/${cleanId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount) })
    });
  },
};

export const GoalsProvider = ({ children }) => {
  const { user } = useAuth();
  //state
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  //fetch goals
  const fetchGoals = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.getUserGoals(user.id);
      if (res?.success) {
        setGoals(res.data || []);
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.error('Fetch goals error:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  //create goal
  const createGoal = useCallback(async (data) => {
    if (!user?.id) {
      Alert.alert('Error', 'Not authenticated');
      return false;
    }
    setLoading(true);
    try {
      //build payload
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

  //add progress
  const addProgress = useCallback(async (goalId, amount) => {
    const cleanId = cleanGoalId(goalId);

    if (!cleanId) {
      Alert.alert('Error', 'Invalid goal ID');
      return false;
    }

    //validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }

    setLoading(true);
    try {
      const res = await api.addProgress(cleanId, numAmount);

      if (res?.success) {
        await fetchGoals();
        Alert.alert('✅ Success', 'Savings added!');
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

  //delete goal
  const deleteGoal = useCallback(async (goalId) => {
    const cleanId = cleanGoalId(goalId);

    if (!cleanId) {
      Alert.alert('Error', 'Goal not found');
      return false;
    }

    setLoading(true);
    try {
      const res = await api.delete(cleanId);
      if (res?.success) {
        setGoals(prev => prev.filter(g => g.id !== cleanId));
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

  //on user change
  useEffect(() => {
    if (user?.id) fetchGoals();
  }, [user?.id, fetchGoals]);

  //context value
  const value = {
    goals,
    loading,
    fetchGoals,
    createGoal,
    addProgress,
    deleteGoal,
    api
  };

  //provide
  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};