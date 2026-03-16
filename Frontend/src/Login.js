import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './hooks/useAuth';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT, INPUT, BUTTON } from './styles/global';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    
    console.log('Attempting login with:', { email });
    
    const result = await login(email, password);
    console.log('Login result:', result);
    
    if (result.success) {
      navigation.replace('MainTabs');
    } else {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[LAYOUT.container, { backgroundColor: COLORS.white }]}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => navigation.goBack()} style={LAYOUT.backButton}>
        <Text style={[TYPOGRAPHY.h2, { color: COLORS.darkGray }]}>←</Text>
      </Pressable>

      <View style={LAYOUT.header}>
        <View style={[styles.logoCircle, { backgroundColor: COLORS.lightGray }]} />
        <Text style={[TYPOGRAPHY.h1, { marginBottom: SPACING.sm }]}>Welcome Back</Text>
        <Text style={TYPOGRAPHY.subtitle}>Sign in to your StudiFi account</Text>
      </View>

      <View style={[INPUT.group, { marginBottom: SPACING.lg }]}>
        <View style={INPUT.group}>
          <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.darkGray }]}>Email</Text>
          <View style={INPUT.wrap}>
            <TextInput
              style={INPUT.field}
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

        <View style={INPUT.group}>
          <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.darkGray }]}>Password</Text>
          <View style={INPUT.wrap}>
            <TextInput
              style={INPUT.field}
              placeholder="Enter password"
              placeholderTextColor={COLORS.mediumGray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={INPUT.eyeButton}
            >
              <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            BUTTON.primary,
            pressed && BUTTON.pressed,
            loading && BUTTON.disabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={BUTTON.text}>Sign In</Text>
          )}
        </Pressable>
      </View>

      <View style={LAYOUT.footer}>
        <Text style={TYPOGRAPHY.caption}>Don't have an account?</Text>
        <Pressable onPress={() => navigation.replace('Register')}>
          <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.navy }]}>Sign Up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = {
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: SPACING.lg,
  },
  eyeText: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '600',
  },
};