import auth from '@react-native-firebase/auth';

// Register new user
export const registerUser = async (email, password) => {
  console.log(auth());
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    console.log('User registered:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    console.log('User logged in:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw new Error(error.message);
  }
};

export const getIdToken = async () => {
  try {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const idToken = await currentUser.getIdToken(); // Retrieve the token
      console.log('User ID Token:', idToken);
      return idToken;
    } else {
      throw new Error('No user is currently logged in.');
    }
  } catch (error) {
    console.error('Error fetching ID Token:', error.message);
    throw error;
  }
};