import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import API_BASE from '../config';

const ExpensesContext = createContext({});
export const useExpenses = () => useContext(ExpensesContext);

const request = async (endpoint, token, options = {}) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    console.log(`[request] ${endpoint} response:`, data);
    if (res.status === 404) return { success: true, data: [] };
    return data;
  } catch (err) {
    console.error(`[request] error for ${endpoint}:`, err);
    return { success: false, data: [] };
  }
};

export const ExpensesProvider = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(user?.monthlyBudget || 1500);

  const fetchExpenses = useCallback(async () => {
    if (!user?.uid) {
      console.log('[fetchExpenses] no uid');
      return;
    }
    console.log('[fetchExpenses] fetching for uid:', user.uid);
    setLoading(true);
    const res = await request(`/expense/user/${user.uid}`, user?.idToken);
    console.log('[fetchExpenses] res.data:', res?.data);
    setExpenses(res?.data || []);
    setLoading(false);
  }, [user]);

  const addExpense = useCallback(async (data) => {
    if (!user?.uid) {
      Alert.alert('Error', 'Not authenticated');
      return false;
    }
    setLoading(true);
    const payload = {
      title: data.title,
      description: data.description || data.title,
      amount: data.amount
    };
    console.log('[addExpense] sending:', payload);
    const res = await request(`/expense/user/${user.uid}`, user?.idToken, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res?.success) {
      console.log('[addExpense] success, fetching expenses...');
      await fetchExpenses();
      Alert.alert('Success', 'Expense added');
      return true;
    } else {
      Alert.alert('Error', res?.message || 'Failed');
      return false;
    }
  }, [user, fetchExpenses]);

  const deleteExpense = useCallback(async (id) => {
    setLoading(true);
    const res = await request(`/expense/${id}`, user?.idToken, { method: 'DELETE' });
    if (res?.success) {
      await fetchExpenses();
      Alert.alert('Success', 'Deleted');
      return true;
    } else {
      Alert.alert('Error', res?.message || 'Failed');
      return false;
    }
  }, [user, fetchExpenses]);

  const updateBudget = useCallback(async (newBudget) => {
    if (!user?.uid) {
      Alert.alert('Error', 'Not authenticated');
      return false;
    }
    setLoading(true);
    const res = await request(`/user/${user.uid}`, user?.idToken, {
      method: 'PUT',
      body: JSON.stringify({ monthlyBudget: newBudget })
    });
    if (res?.success) {
      setBudget(newBudget);
      Alert.alert('Success', 'Budget updated');
      return true;
    } else {
      Alert.alert('Error', res?.message || 'Failed to update budget');
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) fetchExpenses();
  }, [user?.uid, fetchExpenses]);

  useEffect(() => {
    if (user?.monthlyBudget !== undefined) setBudget(user.monthlyBudget);
  }, [user?.monthlyBudget]);

  const total = expenses.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const remaining = budget - total;
  const percent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  const color = percent > 80 ? '#EF4444' : percent > 50 ? '#F59E0B' : '#10B981';

  return (
    <ExpensesContext.Provider value={{
      expenses,
      loading,
      monthlyBudget: budget,
      setMonthlyBudget: updateBudget,
      totalExpenses: total,
      remaining,
      budgetPercent: percent,
      barColor: color,
      fetchExpenses,
      addExpense,
      deleteExpense
    }}>
      {children}
    </ExpensesContext.Provider>
  );
};