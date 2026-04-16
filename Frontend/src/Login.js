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
import { COLORS, SPACING, TYPOGRAPHY, BUTTON } from './styles/global';

const logoImage = require('../src/styles/StudifiLogo.png');

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log('Login button pressed');
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    const result = await login(email, password);
    console.log('Login result', result);
    if (result.success) {
      Alert.alert('Success', 'Logged in!');
    } else {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 18 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Image source={logoImage} style={{ width: 100, height: 100, marginBottom: SPACING.lg }} resizeMode="contain" />
            <Text style={[TYPOGRAPHY.h1, { marginBottom: SPACING.sm }]}>Welcome Back</Text>
            <Text style={TYPOGRAPHY.subtitle}>Sign in to your StudiFi account</Text>
          </View>

          {/* Form */}
          <View style={{ gap: 18 }}>
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
                  placeholder="Enter password"
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

            {/* Button */}
            <Pressable
              style={({ pressed }) => [BUTTON.primary, pressed && BUTTON.pressed, loading && BUTTON.disabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={BUTTON.text}>Sign In</Text>}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 32, paddingTop: 32 }}>
            <Text style={TYPOGRAPHY.caption}>Don't have an account?</Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.navy }]}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 