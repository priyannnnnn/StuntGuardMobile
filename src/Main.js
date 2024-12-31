import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DailyTask from './DailyTasks';
import HomePage from './HomePage';
import Chatbot from './Chatbot';

export default function Main() {

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#f0f0f0' }, // Customize tab bar
      }}
    >
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
      <Tab.Screen name='DailyTask' component={DailyTask}/>
      <Tab.Screen name='Chatbot' component={Chatbot}/>
    </Tab.Navigator>
  );
}