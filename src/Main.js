import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DailyTask from './DailyTasks';
import HomePage from './HomePage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Main() {

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#ffffff', // Set tab bar background
          height: 70, // Increase height for larger tabs
          paddingBottom: 0, // Space below the icons and labels
        },
        tabBarLabelStyle: {
          fontSize: 14, // Larger label text
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#4CAF50', // Active tab color
        tabBarInactiveTintColor: '#888888', // Inactive tab color
      }}
    >
      <Tab.Screen 
        name="DailyTask" 
        component={DailyTask}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="assessment" color={color} size={35} /> // Larger icon size
          ),
          tabBarLabel: 'Daily Tasks', // Customize the label
        }}
      />
      <Tab.Screen 
        name="HomePage" 
        component={HomePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={35} /> // Larger icon size
          ),
          tabBarLabel: 'Home', // Customize the label
        }}
      />
    </Tab.Navigator>
  );
}
