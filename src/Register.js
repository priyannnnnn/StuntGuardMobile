import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Role: experiencing_pregnancy or having_a_toddler

  const handleRegister = async () => {
    if (!role) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    try {
      // Register user with Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      // Save user data including role to Firebase Realtime Database
      await database().ref(`/users/${userId}`).set({
        name: name,
        email: email,
        role: role, // Save the selected role
        data: {},   // Initialize data as empty
      });

      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('Login'); // Navigate to the Login screen
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'That email address is invalid!');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Nama Lengkap"
          placeholderTextColor="#C4C4C4"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Email"
          placeholderTextColor="#C4C4C4"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Password"
          placeholderTextColor="#C4C4C4"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <Text style={styles.label}>Choose Roles:</Text>
        <TouchableOpacity
          style={[styles.roleButton, role === 'experiencing_pregnancy' && styles.roleSelected]}
          onPress={() => setRole('experiencing_pregnancy')}
        >
          <Text style={styles.roleText}>Experiencing Pregnancy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'having_a_toddler' && styles.roleSelected]}
          onPress={() => setRole('having_a_toddler')}
        >
          <Text style={styles.roleText}>Having a Toddler</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3E5F5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#000',
  },
  roleContainer: { marginVertical: 20 },
  roleButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  roleSelected: { backgroundColor: '#7E57C2' },
  roleText: { color: '#333', fontWeight: 'bold', textAlign: 'center' },
  submitButton: {
    backgroundColor: '#7E57C2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default Register;
