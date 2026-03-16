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
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT, INPUT, BUTTON, UTILS } from './styles/global';

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
    
    console.log('Attempting registration with:', { username, email });
    
    const result = await register({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password
    });
    
    console.log('Registration result:', result);
    
    if (result.success) {
      Alert.alert('Success', result.message, [
        { text: 'OK', onPress: () => navigation.replace('Login') }
      ]);
    } else {
      Alert.alert('Registration Failed', result.message);
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
        <Text style={[TYPOGRAPHY.h1, { marginBottom: SPACING.sm }]}>Create Account</Text>
        <Text style={[TYPOGRAPHY.subtitle, UTILS.textCenter]}>
          Join StudiFi and take control of your finances
        </Text>
      </View>

      <View style={[INPUT.group, { marginBottom: SPACING.lg }]}>
        <View style={INPUT.group}>
          <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.darkGray }]}>Username</Text>
          <View style={INPUT.wrap}>
            <TextInput
              style={INPUT.field}
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
              placeholder="Create a password"
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

        <View style={INPUT.group}>
          <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.darkGray }]}>Confirm Password</Text>
          <View style={INPUT.wrap}>
            <TextInput
              style={INPUT.field}
              placeholder="Confirm your password"
              placeholderTextColor={COLORS.mediumGray}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={INPUT.eyeButton}
            >
              <Text style={styles.eyeText}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            BUTTON.primary,
            pressed && BUTTON.pressed,
            loading && BUTTON.disabled,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={BUTTON.text}>Create Account</Text>
          )}
        </Pressable>
      </View>

      <View style={LAYOUT.footer}>
        <Text style={TYPOGRAPHY.caption}>Already have an account?</Text>
        <Pressable onPress={() => navigation.replace('Login')}>
          <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.navy }]}>Sign In</Text>
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