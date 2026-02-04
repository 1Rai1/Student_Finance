import "./global.css"

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import Expenses from "./Frontend/Screens/Expenses"
import Goals from "./Frontend/Screens/Goals"
import Investments from "./Frontend/Screens/Investments"
import Discounts from "./Frontend/Screens/Discounts"
import Register from './Frontend/Screens/Register';
import Login from "./Frontend/Screens/Login"

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Expenses" component={Expenses} />
        <Tab.Screen name="Invesments" component={Investments} />
        <Tab.Screen name="Goals" component={Goals} />
        <Tab.Screen name="Discounts" component={Discounts} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}