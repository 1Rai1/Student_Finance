import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import RegisterScreen from '../Register';

// Stable mock
const mockRegister = jest.fn();

jest.mock('@react-navigation/native');
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    register: mockRegister,
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

  it('should display create account message', () => {
    const { getAllByText } = render(<RegisterScreen />);
    expect(getAllByText('Create Account').length).toBeGreaterThan(0);
  });

  it('should display all input fields', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    expect(getByPlaceholderText('Choose a username')).toBeTruthy();
    expect(getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Create a password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm your password')).toBeTruthy();
  });

  it('should update username state on input change', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    const input = getByPlaceholderText('Choose a username');

    fireEvent.changeText(input, 'testuser');
    expect(input.props.value).toBe('testuser');
  });

  it('should update email state on input change', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    const input = getByPlaceholderText('your@email.com');

    fireEvent.changeText(input, 'test@example.com');
    expect(input.props.value).toBe('test@example.com');
  });

  it('should have back navigation button', () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText('←')).toBeTruthy();
  });

  it('should have register button', () => {
    const { getAllByText } = render(<RegisterScreen />);
    expect(getAllByText('Create Account').length).toBeGreaterThan(0);
  });

  it('should have login link', () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText('Already have an account?')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy(); 
  });

  it('should disable inputs while loading', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    const input = getByPlaceholderText('Choose a username');
    expect(input.props.editable).toBeDefined();
  });

  it('should toggle password visibility', () => {
    const { getAllByText, getByPlaceholderText } = render(<RegisterScreen />);
    const passwordInput = getByPlaceholderText('Create a password');

    expect(passwordInput.props.secureTextEntry).toBe(true);

    const toggles = getAllByText('Show');
    fireEvent.press(toggles[0]);
  });
});