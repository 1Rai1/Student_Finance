import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import API_BASE from '../config';

//context
const ExpensesContext = createContext({});
export const useExpenses = () => useContext(ExpensesContext);

//fetch helper
const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    const data = await res.json();
    return res.status === 404 ? { success: true, data: [] } : data;
  } catch {
    return { success: false, data: [] };
  }
};

//endpoints
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
  //state
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(user?.monthlyBudget || 1500);

  //fetch expenses
  const fetchExpenses = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await api.get(user.id);
    setExpenses(res?.data || []);
    setLoading(false);
  }, [user?.id]);

  //add expense
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

  //delete expense
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

  //on user change
  useEffect(() => {
    if (user?.id) fetchExpenses();
  }, [user?.id, fetchExpenses]);

  //sync budget
  useEffect(() => {
    if (user?.monthlyBudget) setBudget(user.monthlyBudget);
  }, [user?.monthlyBudget]);

  //computed values
  const total = expenses.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const remaining = budget - total;
  const percent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  //bar color
  const color = percent > 80 ? '#EF4444' : percent > 50 ? '#F59E0B' : '#10B981';

  //provide
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