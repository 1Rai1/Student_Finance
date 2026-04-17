import { createContext, useContext, useState } from 'react';
import { useAuth } from './useAuth';
import API_BASE from '../config';

const AdminContext = createContext({});
export const useAdmin = () => useContext(AdminContext);

const getAuthHeader = (user) => {
  if (user?.idToken) return { 'Authorization': `Bearer ${user.idToken}` };
  return {};
};

const request = async (endpoint, user, options = {}) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(user),
      ...options.headers,
    };
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    return await res.json();
  } catch {
    return { success: false };
  }
};

export function AdminProvider({ children }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]); // this is fine, we define it here
  const [loading, setLoading] = useState(false);

  const fetchLessons = async () => {
    setLoading(true);
    const res = await request('/lesson', user);
    if (res?.success) setLessons(res.data || []);
    setLoading(false);
  };

  const createLesson = async (data) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request('/lesson', user, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res?.success) await fetchLessons();
    return res;
  };

  const updateLesson = async (id, data) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request(`/lesson/${id}`, user, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (res?.success) await fetchLessons();
    return res;
  };

  const deleteLesson = async (id) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request(`/lesson/${id}`, user, { method: 'DELETE' });
    if (res?.success) {
      setLessons(prev => prev.filter(l => l.id !== id));
      setQuizzes([]);
    }
    return res;
  };

  const fetchQuizzes = async (lessonId) => {
    setLoading(true);
    const res = await request(`/lesson/${lessonId}/quiz`, user);
    if (res?.success) setQuizzes(res.data || []);
    else setQuizzes([]);
    setLoading(false);
  };

  const createQuiz = async (lessonId, data) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request(`/lesson/${lessonId}/quiz`, user, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res?.success) await fetchQuizzes(lessonId);
    return res;
  };

  const deleteQuiz = async (lessonId, quizId) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request(`/lesson/${lessonId}/quiz/${quizId}`, user, { method: 'DELETE' });
    if (res?.success) {
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
    }
    return res;
  };

  const adminDeletePost = async (postId) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request(`/discount/${postId}`, user, { method: 'DELETE' });
    return res;
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      lessons,
      quizzes,
      loading,
      fetchLessons,
      createLesson,
      updateLesson,
      deleteLesson,
      fetchQuizzes,
      createQuiz,
      deleteQuiz,
      adminDeletePost,
    }}>
      {children}
    </AdminContext.Provider>
  );
}