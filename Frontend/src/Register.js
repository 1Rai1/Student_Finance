import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './hooks/useAuth';
import { COLORS, SPACING, TYPOGRAPHY, BUTTON, UTILS } from './styles/global';

const logoImage = require('../src/styles/StudifiLogo.png');

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    const result = await register({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password
    });

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Dashboard') }
      ]);
    } else {
      Alert.alert('Registration Failed', result.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 18 }}>
          {/* Back button */}
          <Pressable onPress={() => navigation.goBack()} style={{ width: 44, height: 44, justifyContent: 'center', marginBottom: 8 }}>
            <Text style={[TYPOGRAPHY.h2, { color: COLORS.darkGray }]}>←</Text>
          </Pressable>

          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Image source={logoImage} style={{ width: 100, height: 100, marginBottom: SPACING.lg }} resizeMode="contain" />
            <Text style={[TYPOGRAPHY.h1, { marginBottom: SPACING.sm }]}>Create Account</Text>
            <Text style={[TYPOGRAPHY.subtitle, UTILS.textCenter]}>Join StudiFi and take control of your finances</Text>
          </View>

          {/* Form */}
          <View style={{ gap: 18 }}>
            {/* Username */}
            <View>
              <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.darkGray, marginBottom: 8 }]}>Username</Text>
              <View style={{ backgroundColor: '#F8F9FA', borderRadius: 14, borderWidth: 1, borderColor: '#E9ECEF', height: 52 }}>
                <TextInput
                  style={{ flex: 1, paddingHorizontal: 14, fontSize: 16, color: '#333', height: 52 }}
                  placeholder="Choose a username"
                  placeholderTextColor={COLORS.mediumGray}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.darkGray, marginBottom: 8 }]}>Email</Text>
              <View style={{ backgroundColor: '#F8F9FA', borderRadius: 14, borderWidth: 1, borderColor: '#E9ECEF', height: 52 }}>
                <TextInput
                  style={{ flex: 1, paddingHorizontal: 14, fontSize: 16, color: '#333', height: 52 }}
                  placeholder="your@email.com"
                  placeholderTextColor={COLORS.mediumGray}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.darkGray, marginBottom: 8 }]}>Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 14, borderWidth: 1, borderColor: '#E9ECEF', height: 52 }}>
                <TextInput
                  style={{ flex: 1, paddingHorizontal: 14, fontSize: 16, color: '#333', height: 52 }}
                  placeholder="Create a password"
                  placeholderTextColor={COLORS.mediumGray}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ paddingHorizontal: 14 }}
                  focusable={false}
                  accessible={false}
                >
                  <Text style={{ color: COLORS.navy, fontSize: 14, fontWeight: '600' }}>{showPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.darkGray, marginBottom: 8 }]}>Confirm Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 14, borderWidth: 1, borderColor: '#E9ECEF', height: 52 }}>
                <TextInput
                  style={{ flex: 1, paddingHorizontal: 14, fontSize: 16, color: '#333', height: 52 }}
                  placeholder="Confirm your password"
                  placeholderTextColor={COLORS.mediumGray}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ paddingHorizontal: 14 }}
                  focusable={false}
                  accessible={false}
                >
                  <Text style={{ color: COLORS.navy, fontSize: 14, fontWeight: '600' }}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>

            {/* Button */}
            <Pressable
              style={({ pressed }) => [BUTTON.primary, pressed && BUTTON.pressed, loading && BUTTON.disabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={BUTTON.text}>Create Account</Text>}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 32, paddingTop: 32 }}>
            <Text style={TYPOGRAPHY.caption}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.navy }]}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}