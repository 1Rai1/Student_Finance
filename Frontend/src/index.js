import React, { useRef } from 'react';
import { Text, View, Pressable, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT, BUTTON, IMAGES, UTILS } from './styles/global';

export default function LandingScreen() {
  const navigation = useNavigation();
  const features = ['Track expenses & budgets', 'Learn to invest smart', 'Set & achieve goals', 'Find student discounts'];
  
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleGetStarted = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => navigation.navigate('Login'));
  };

  return (
    <Animated.View style={[
      UTILS.flex1, 
      { backgroundColor: COLORS.cream },
      {
        transform: [{
          translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -500]
          })
        }]
      }
    ]}>
      <View style={[
        UTILS.flex1, 
        UTILS.justifyCenter, 
        { paddingHorizontal: SPACING.xl }
      ]}>
        <View style={[UTILS.itemsCenter, { marginBottom: SPACING.xxl }]}>
          <Image 
            source={require('./styles/StudifiLogo.png')} 
            style={IMAGES.logo}
            contentFit="contain"
          />
        </View>

        <View style={{ gap: SPACING.lg }}>
          {features.map((text, i) => (
            <View key={i} style={LAYOUT.featureRow}>
              <View style={[LAYOUT.bullet, { backgroundColor: COLORS.green }]} />
              <Text style={[TYPOGRAPHY.body, { color: COLORS.black }]}>{text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl, paddingTop: SPACING.lg }}>
        <Pressable
          style={({ pressed }) => [
            BUTTON.primary,
            BUTTON.rounded,
            LAYOUT.buttonRow,
            pressed && BUTTON.pressed
          ]}
          onPress={handleGetStarted}
        >
          <Text style={BUTTON.text}>Getting Started</Text>
          <Text style={TYPOGRAPHY.buttonArrow}>→</Text>
        </Pressable>
        
        <Text style={[
          TYPOGRAPHY.caption, 
          UTILS.textCenter, 
          { marginTop: SPACING.lg, color: COLORS.gray }
        ]}>
          Already have an account? <Text style={TYPOGRAPHY.link} onPress={() => navigation.navigate('Login')}>Sign In</Text>
        </Text>
      </View>
    </Animated.View>
  );
}