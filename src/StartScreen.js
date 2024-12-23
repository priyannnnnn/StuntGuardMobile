import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import Login from './Login';
import HomePage2 from './HomePage2';
import HomePage from './HomePage';
import Home from './Home';
import Main from './Main';
import LandingPage from './LandingPage';
import PregnantWomanData from './PregnantWomanData';
// import Login from './Login';

function StartScreen({navigation}){
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    console.log(user)
    setUser(user); // Set user object
    if (initializing) setInitializing(false); // Stop loading when state is initialized
  }

  useEffect(() => {
    // Subscribe to Firebase auth state
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  // if (initializing) {
  // return(
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#7E57C2" />
  //     </View>
  //   );
  // }
  // return user ? <LandingPage/> : <Login/>;
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7E57C2" />
      </View>
    );
  }
  
  if (user) {
    navigation.replace('LandingPage'); // Replace StartScreen with LandingPage
    return null;
  }
  
  navigation.replace('HomePage2'); // Replace StartScreen with Login
  return null;
}
export default StartScreen;