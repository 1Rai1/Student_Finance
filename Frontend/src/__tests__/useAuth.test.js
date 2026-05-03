import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, AuthProvider } from '../hooks/useAuth';
import React from 'react';

// ✅ mock config
jest.mock('../config', () => 'http://test-api');

// ✅ mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ✅ mock fetch
global.fetch = jest.fn();

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) =>
    React.createElement(AuthProvider, null, children);

  // ---------------- LOGIN ----------------
  describe('Login functionality', () => {
    it('should handle login errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      const response = await act(async () => {
        return await result.current.login('test@test.com', '123456');
      });

      expect(response.success).toBe(false);
      expect(response.message).toBe('User not found'); 
    });
  });

  // ---------------- REGISTER ----------------
  describe('Registration functionality', () => {
    it('should return error if email already exists', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({
          data: [{ email: 'test@test.com' }],
        }),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      const response = await act(async () => {
        return await result.current.register({
          username: 'test',
          email: 'test@test.com',
          password: '123456',
        });
      });

      expect(response.success).toBe(false);
      expect(response.message).toBe('Email exists');
    });
  });

  // ---------------- SESSION ----------------
  describe('Session restoration', () => {
    it('should restore user from AsyncStorage on mount', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));

      renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('user');
      });
    });

    it('should handle missing user in AsyncStorage', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('user');
      });
    });
  });

  // ---------------- LOADING ----------------
  describe('Loading state', () => {
    it('should provide loading state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.loading).toBe('boolean');
    });
  });

  // ---------------- USER ----------------
  describe('User context', () => {
    it('should provide user state (initially null)', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull(); 
    });
  });
});