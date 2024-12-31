import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-native-paper';
import Home from './src/Home';
import Profile from './src/Profile';
import HomePage from './src/HomePage';
import DailyTask from './src/DailyTasks';
import RecordIntake from './src/RecordIntake';
import homePage2 from './src/HomePage2';
import homePage3 from './src/HomePage3';
import HealthyFoodApp from './src/HealthyFoodApp';
import GetAllData from './src/Data';
import Login from './src/Login';
import Register from './src/Register';
import LandingPage from './src/LandingPage';
import PregnantWomanData from './src/PregnantWomanData';
import BabyForm from './src/BabyForm';
import StuntingRisk from './src/StuntingRisk';
import DataControl from './src/DataControl';
import Example from './src/Url';
import EatVegetables from './src/EatVegetables';
import EatFruit from './src/EatFruit';
import StartScreen from './src/StartScreen';
import Main from './src/Main';
import ImmunizationForm from './src/Vaksin';
import DataImunization from './src/DataImunization';
import UpdateDataControl from './src/UpdateDataControl';
import Chatbot from './src/Chatbot';

// Define your stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main App Component
export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Main screen uses BottomTabs */}
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name='Home' component={Home}/>
          <Stack.Screen name='Profile' component={Profile}/>
          <Stack.Screen name='HomePage' component={HomePage}/>
          <Stack.Screen name='RecordIntake' component={RecordIntake}/>
          <Stack.Screen name='HomePage2' component={homePage2}/>
          <Stack.Screen name='HomePage3' component={homePage3}/>
          <Stack.Screen name='HealthyFoodApp' component={HealthyFoodApp}/>
          <Stack.Screen name='GetAllData' component={GetAllData}/>
          <Stack.Screen name='Login' component={Login}/>
          <Stack.Screen name='Register' component={Register}/>
          <Stack.Screen name='LandingPage' component={LandingPage}/>
          <Stack.Screen name='PregnantWomanData' component={PregnantWomanData}/>
          <Stack.Screen name='BabyForm' component={BabyForm}/>
          <Stack.Screen name='StuntingRisk' component={StuntingRisk}/>
          <Stack.Screen name='DataControl' component={DataControl}/>
          <Stack.Screen name='Example' component={Example}/>
          <Stack.Screen name='EatVegetables' component={EatVegetables}/>
          <Stack.Screen name='EatFruit' component={EatFruit}/>
          <Stack.Screen name='StartScreen' component={StartScreen}/>
          <Stack.Screen name='ImmunizationForm' component={ImmunizationForm}/>
          <Stack.Screen name='DataImunization' component={DataImunization}/>
          <Stack.Screen name='Chatbot' component={Chatbot}/>
          <Stack.Screen name='UpdateDataControl' component={UpdateDataControl}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
