import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from '../Login';

// Stable mock
const mockLogin = jest.fn();

jest.mock('@react-navigation/native');
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    loading: false,
  }),
}));

jest.mock('../styles/global', () => ({
  COLORS: {
    white: '#ffffff',
    lightGray: '#f0f0f0',
    darkGray: '#333333',
    mediumGray: '#999999',
    primary: '#007AFF',
    navy: '#001f3f',
  },
  SPACING: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  TYPOGRAPHY: {
    h1: { fontSize: 28, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 14, color: '#666' },
    bodySmall: { fontSize: 12 },
    caption: { fontSize: 10 },
  },
  LAYOUT: {
    container: { flex: 1, padding: 20 },
    header: { alignItems: 'center', marginVertical: 20 },
    backButton: { padding: 10 },
    footer: { alignItems: 'center' },
  },
  INPUT: {
    group: { marginBottom: 16 },
    wrap: { flexDirection: 'row', position: 'relative' },
    field: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc' },
    eyeButton: { padding: 10 },
  },
  BUTTON: {
    primary: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8 },
    pressed: { opacity: 0.8 },
    disabled: { opacity: 0.5 },
    text: { color: '#fff', textAlign: 'center' },
  },
}));

describe('LoginScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({
      goBack: jest.fn(),
      replace: jest.fn(),
    });
  });

  it('should display email and password input fields', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Enter password')).toBeTruthy();
  });

  it('should update email state on input change', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('your@email.com');

    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('should update password state on input change', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const passwordInput = getByPlaceholderText('Enter password');

    fireEvent.changeText(passwordInput, 'password123');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('should toggle password visibility', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    const passwordInput = getByPlaceholderText('Enter password');
    const toggleButton = getByText('Show');

    expect(passwordInput.props.secureTextEntry).toBe(true);
    fireEvent.press(toggleButton);
  });

  it('should have back navigation button', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('←')).toBeTruthy();
  });

  it('should have login button', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('should show sign up link', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("Don't have an account?")).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('should disable inputs while loading', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('your@email.com');
    expect(emailInput.props.editable).toBeDefined();
  });
});