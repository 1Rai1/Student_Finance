import { renderHook } from '@testing-library/react-native';
import React from 'react';
import { useAuth, AuthProvider } from '../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../config', () => 'http://192.168.100.63:5000/api');

/**
 * Generic test suite for custom hooks
 */
describe('Custom Hooks', () => {
  describe('useAuth Hook', () => {
    it('should initialize with required properties', () => {
      const wrapper = ({ children }) => (
        React.createElement(AuthProvider, null, children)
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('register');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('initializing');
    });

    it('should have login as a function', () => {
      const wrapper = ({ children }) => (
        React.createElement(AuthProvider, null, children)
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.login).toBe('function');
    });

    it('should have register as a function', () => {
      const wrapper = ({ children }) => (
        React.createElement(AuthProvider, null, children)
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.register).toBe('function');
    });

    it('should have logout as a function', () => {
      const wrapper = ({ children }) => (
        React.createElement(AuthProvider, null, children)
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.logout).toBe('function');
    });
  });
});
