// Frontend/src/hooks/useExpenses.js
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';

const ExpensesContext = createContext({});
export const useExpenses = () => useContext(ExpensesContext);

const API = 'http://192.168.2.13:5000/api';

const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    const data = await res.json();
    return res.status === 404 ? { success: true, data: [] } : data;
  } catch {
    return { success: false, data: [] };
  }
};

const api = {
  get: (uid) => request(`/expense/user/${uid}`),
  add: (uid, d) => request(`/expense/user/${uid}`, {
    method: 'POST',
    body: JSON.stringify(d)
  }),
  del: (id) => request(`/expense/${id}`, { method: 'DELETE' })
};

export const ExpensesProvider = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(user?.monthlyBudget || 1500);

  const fetchExpenses = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await api.get(user.id);
    setExpenses(res?.data || []);
    setLoading(false);
  }, [user?.id]);

  const addExpense = useCallback(async (data) => {
    if (!user?.id) {
      Alert.alert('Error', 'Not authenticated');
      return false;
    }
    setLoading(true);
    const res = await api.add(user.id, data);
    if (res?.success) {
      await fetchExpenses();
      Alert.alert('Success', 'Expense added');
      return true;
    } else {
      Alert.alert('Error', res?.message || 'Failed');
      return false;
    }
  }, [user?.id, fetchExpenses]);

  const deleteExpense = useCallback(async (id) => {
    setLoading(true);
    const res = await api.del(id);
    if (res?.success) {
      await fetchExpenses();
      Alert.alert('Success', 'Deleted');
      return true;
    } else {
      Alert.alert('Error', res?.message || 'Failed');
      return false;
    }
  }, [fetchExpenses]);

  useEffect(() => {
    if (user?.id) fetchExpenses();
  }, [user?.id, fetchExpenses]);

  useEffect(() => {
    if (user?.monthlyBudget) setBudget(user.monthlyBudget);
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
      setMonthlyBudget: setBudget,
      totalExpenses: total,
      remaining,
      budgetPercent: percent,
      barColor: color,
      fetchExpenses,
      addExpense,
      deleteExpense,
      api
    }}>
      {children}
    </ExpensesContext.Provider>
  );
};