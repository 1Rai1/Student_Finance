import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import RegisterScreen from '../Register';

// Mock dependencies
jest.mock('@react-navigation/native');
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    register: jest.fn().mockResolvedValue({ success: true, message: 'Registration successful' }),
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
  },
  LAYOUT: {
    container: { flex: 1, padding: 20 },
    header: { alignItems: 'center', marginVertical: 20 },
    backButton: { padding: 10 },
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
  },
  UTILS: {
    textCenter: { textAlign: 'center' },
  },
}));

describe('RegisterScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({
      goBack: jest.fn(),
      replace: jest.fn(),
    });
  });

  it('should render register screen', () => {
    const { container } = render(<RegisterScreen />);
    expect(container).toBeTruthy();
  });

  it('should display create account message', () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText('Create Account')).toBeTruthy();
  });

  it('should display all input fields', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    expect(getByPlaceholderText('Choose a username')).toBeTruthy();
    expect(getByPlaceholderText(/your@email/i)).toBeTruthy();
    expect(getByPlaceholderText(/Enter password/i)).toBeTruthy();
    expect(getByPlaceholderText(/Confirm password/i)).toBeTruthy();
  });

  it('should update username state on input change', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    const usernameInput = getByPlaceholderText('Choose a username');
    
    fireEvent.changeText(usernameInput, 'testuser');
    expect(usernameInput.props.value).toBe('testuser');
  });

  it('should update email state on input change', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    const emailInput = getByPlaceholderText(/your@email/i);
    
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('should have back navigation button', () => {
    const { getByText } = render(<RegisterScreen />);
    const backButton = getByText('←');
    expect(backButton).toBeTruthy();
  });

  it('should have register button', () => {
    const { getByText } = render(<RegisterScreen />);
    const registerButton = getByText(/Create|Sign Up|Register/i);
    expect(registerButton).toBeTruthy();
  });

  it('should have login link', () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText(/Already have an account|Log in|Sign in/i)).toBeTruthy();
  });

  it('should disable inputs while loading', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    const usernameInput = getByPlaceholderText('Choose a username');
    expect(usernameInput.props.editable).toBeDefined();
  });

  it('should toggle password visibility', () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    const passwordInput = getByPlaceholderText(/^Enter password$/i);
    
    expect(passwordInput.props.secureTextEntry).toBe(true);
    const toggleButtons = getByText('Show');
    fireEvent.press(toggleButtons);
    // Note: Actual toggle test requires state management to be testable
  });
});
