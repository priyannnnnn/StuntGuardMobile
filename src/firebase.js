import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDPckDg-y6OtoVqpXsSzsMwqHUIxQh-N7I",
  authDomain: "com.mobiledevv",
  databaseURL: "https://supri-74ec7-default-rtdb.firebaseio.com/",
  projectId: "supri-74ec7",
  storageBucket: "supri-74ec7.firebasestorage.app",
  messagingSenderId: "1013091713319",
  appId: "1:1013091713319:android:590b91a81858689e642902",
};

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

export default firebase;
