import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import API_BASE from '../config';

//base URL
const BASE = `${API_BASE}/discount`;
//context
const DiscountsContext = createContext();

export function DiscountsProvider({ children }) {
  const { user } = useAuth();
  //state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const uid = user?.id;

  //fetch all posts
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

  //on mount
  useEffect(() => { fetchPosts(); }, []);

  //create post
  const createPost = async ({ title, description, location, imageUri }) => {
    if (!uid) return { success: false, message: 'Not logged in' };
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('location', location);
    //attach image
    if (imageUri) {
      const filename = imageUri.split('/').pop();
      const ext = filename.split('.').pop().toLowerCase();
      form.append('image', { uri: imageUri, name: filename, type: `image/${ext}` });
    }
    const res = await fetch(`${BASE}/user/${uid}`, { method: 'POST', body: form });
    const json = await res.json();
    if (json.success) setPosts(prev => [json.data, ...prev]);
    return json;
  };

  //like post
  const likePost = async (postId) => {
    const res = await fetch(`${BASE}/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid }),
    });
    const json = await res.json();
    if (json.success)
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: json.likes } : p));
    return json;
  };

  //vote post
  const votePost = async (postId, vote) => {
    const res = await fetch(`${BASE}/${postId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid, vote }),
    });
    const json = await res.json();
    if (json.success)
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, votes: json.votes, verificationStatus: json.verificationStatus } : p
      ));
    return json;
  };

  //get messages
  const getMessages = async (postId) => {
    const res = await fetch(`${BASE}/${postId}/messages`);
    const json = await res.json();
    return json.success ? json.data : [];
  };

  //add message
  const addMessage = async (postId, message) => {
    const res = await fetch(`${BASE}/${postId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid, message }),
    });
    const json = await res.json();
    if (json.success)
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, messages: (p.messages || 0) + 1 } : p));
    return json;
  };

  //delete post
  const deletePost = async (postId) => {
    const res = await fetch(`${BASE}/${postId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) setPosts(prev => prev.filter(p => p.id !== postId));
    return json;
  };

  //provide
  return (
    <DiscountsContext.Provider value={{ posts, loading, fetchPosts, createPost, likePost, votePost, getMessages, addMessage, deletePost }}>
      {children}
    </DiscountsContext.Provider>
  );
}

export const useDiscounts = () => useContext(DiscountsContext);