import { createContext, useContext, useState } from 'react';
import { useAuth } from './useAuth';
import API_BASE from '../config';

//context
const AdminContext = createContext({});
export const useAdmin = () => useContext(AdminContext);

//fetch helper
const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    return await res.json();
  } catch {
    return { success: false };
  }
};

export function AdminProvider({ children }) {
  const { user } = useAuth();
  //admin check
  const isAdmin = user?.role === 'admin';

  //lessons state
  const [lessons, setLessons] = useState([]);
  //quizzes state
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  //fetch lessons
  const fetchLessons = async () => {
    setLoading(true);
    const res = await request('/lesson');
    if (res?.success) setLessons(res.data || []);
    setLoading(false);
  };

  //create lesson
  const createLesson = async (data) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request('/lesson', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res?.success) await fetchLessons();
    return res;
  };

  //update lesson
  const updateLesson = async (id, data) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request(`/lesson/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (res?.success) await fetchLessons();
    return res;
  };

  //delete lesson
  const deleteLesson = async (id) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request(`/lesson/${id}`, { method: 'DELETE' });
    if (res?.success) setLessons(prev => prev.filter(l => l.id !== id));
    return res;
  };

  //fetch quizzes
  const fetchQuizzes = async (lessonId) => {
    setLoading(true);
    const res = await request(`/lesson/${lessonId}/quiz`);
    if (res?.success) setQuizzes(res.data || []);
    setLoading(false);
  };

  //create quiz
  const createQuiz = async (lessonId, data) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request(`/lesson/${lessonId}/quiz`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res?.success) await fetchQuizzes(lessonId);
    return res;
  };

  //delete quiz
  const deleteQuiz = async (lessonId, quizId) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request(`/lesson/${lessonId}/quiz/${quizId}`, { method: 'DELETE' });
    if (res?.success) setQuizzes(prev => prev.filter(q => q.id !== quizId));
    return res;
  };

  //admin delete any discount post
  const adminDeletePost = async (postId) => {
    if (!isAdmin) return { success: false, message: 'Unauthorized' };
    const res = await request(`/discount/${postId}`, { method: 'DELETE' });
    return res;
  };

  //provide
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