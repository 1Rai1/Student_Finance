import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';

import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { ExpensesProvider } from './src/hooks/useExpenses'; // Add this import
import LandingScreen from './src/index';
import LoginScreen from './src/Login';
import RegisterScreen from './src/Register';
import ExpensesScreen from './src/navbar/expenses';
import GoalsScreen from './src/navbar/goals';
import DiscountsScreen from './src/navbar/discounts';
import InvestmentsScreen from './src/navbar/investments';
import { GoalsProvider } from './src/hooks/useGoals';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0A2463',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E9ECEF',
          backgroundColor: '#FFFFFF',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Expenses" 
        component={ExpensesScreen}
        options={{
          tabBarLabel: 'Expenses',
        }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsScreen}
        options={{
          tabBarLabel: 'Goals',
        }}
      />
      <Tab.Screen 
        name="Discounts" 
        component={DiscountsScreen}
        options={{
          tabBarLabel: 'Discounts',
        }}
      />
      <Tab.Screen 
        name="Invest" 
        component={InvestmentsScreen}
        options={{
          tabBarLabel: 'Invest',
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#0A2463" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ExpensesProvider> {/* Add ExpensesProvider here */}
          <GoalsProvider>
            <AppNavigator />
          </GoalsProvider>
        </ExpensesProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}