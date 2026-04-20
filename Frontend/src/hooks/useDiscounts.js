import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import API_BASE from '../config';

const BASE = `${API_BASE}/discount`;
const DiscountsContext = createContext();

export function DiscountsProvider({ children }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const uid = user?.uid;
  const token = user?.idToken;

  // Helper for authenticated requests
  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };
    const res = await fetch(url, { ...options, headers });
    return res.json();
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE);
      const json = await res.json();
      if (json.success) setPosts(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // Create post (without image)
  const createPost = async ({ title, description, location }) => {
    if (!uid) return { success: false, message: 'Not logged in' };
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('location', location);
    // No image for now
    const res = await fetch(`${BASE}/user/${uid}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form,
    });
    const json = await res.json();
    if (json.success) setPosts(prev => [json.data, ...prev]);
    return json;
  };

  const likePost = async (postId) => {
    const json = await authFetch(`${BASE}/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId: uid }),
    });
    if (json.success) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: json.likes } : p));
    }
    return json;
  };

  const votePost = async (postId, vote) => {
    const json = await authFetch(`${BASE}/${postId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ userId: uid, vote }),
    });
    if (json.success) {
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, votes: json.votes, verificationStatus: json.verificationStatus } : p
      ));
    }
    return json;
  };

  const getMessages = async (postId) => {
    const res = await fetch(`${BASE}/${postId}/messages`);
    const json = await res.json();
    return json.success ? json.data : [];
  };

  const addMessage = async (postId, message) => {
    const json = await authFetch(`${BASE}/${postId}/message`, {
      method: 'POST',
      body: JSON.stringify({ userId: uid, message }),
    });
    if (json.success) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, messages: (p.messages || 0) + 1 } : p));
    }
    return json;
  };

  const deletePost = async (postId) => {
    const json = await authFetch(`${BASE}/${postId}`, { method: 'DELETE' });
    if (json.success) setPosts(prev => prev.filter(p => p.id !== postId));
    return json;
  };

  return (
    <DiscountsContext.Provider value={{ posts, loading, fetchPosts, createPost, likePost, votePost, getMessages, addMessage, deletePost }}>
      {children}
    </DiscountsContext.Provider>
  );
}

export const useDiscounts = () => useContext(DiscountsContext);