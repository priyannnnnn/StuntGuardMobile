import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import axios from "axios";
import database from '@react-native-firebase/database';

const StuntingRisk = () => {
  const [data, setData] = useState([]);
  const currentUser = auth().currentUser;
  const databaseUrl = 'https://supri-74ec7-default-rtdb.firebaseio.com'; // Replace with your Firebase database URL

  // const fetchData = async () => {
  //   if (!currentUser) {
  //     Alert.alert('Error', 'You must be logged in to view data.');
  //     return;
  //   }

  //   const currentDate = new Date().toISOString().split('T')[0];

  //   try {
  //     // Get the user's ID token for authentication
  //     const idToken = await currentUser.getIdToken();

  //     // Build the URL for the specific data path
  //     const url = `${databaseUrl}/users/${currentUser.uid}/data.json?auth=${idToken}`;

  //     // Make the GET request
  //     const response = await axios.get(url);
  //     if (response.data) {
  //       // const fetchedData = response.data ? Object.values(response.data) : []
  //       console.log("Fetch Data =", response.data)
  //       setData(response.data);
  //     } else {
  //       console.log('No data found for this date.');
  //       Alert.alert('Info', 'No data found for today.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     Alert.alert('Error', 'Failed to fetch data.');
  //   }
  // }
  const fetchData = async () => {
    const currentUser = auth().currentUser;
  
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to view data.');
      return;
    }
  
    try {
      console.log('Fetching the most recent data...');
      const snapshot = await database()
        .ref(`/users/${currentUser.uid}/data`)
        .orderByKey() // Assumes keys are timestamps or incrementing numbers
        .limitToLast(1) // Fetch only the most recent entry
        .once('value');
  
      if (snapshot.exists()) {
        const responseData = snapshot.val();
  
        // Normalize the fetched data (Firebase returns an object even if one entry is fetched)
        const fetchedData = Object.keys(responseData).map((key) => ({
          id: key,
          ...responseData[key],
        }));
  
        console.log('Most Recent Data:', fetchedData);
        setData(fetchedData[0]); // Use the most recent data entry
      } else {
        console.log('No recent data found.');
        Alert.alert('Info', 'No recent data found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch the most recent data.');
    }
  };
  
  useEffect(() =>{
    fetchData()
  },[])
  
  return (
    <ScrollView style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Stunting Risk</Text>
      <Text style={styles.percentage}>{data.stuntingPercentage}%</Text>
      <Text style={styles.riskLevel}>Stunting Risk Level: {data.stuntingLevel}</Text>
    </View>
  
    {/* Section: Stunting Details */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Stunting Details</Text>
      <Text style={styles.subtitle}>Malnutrition in Toddlers</Text>
      <Text style={styles.text}>
        Malnutrition is the main cause of stunting in toddlers. Below are the details of its causes:
      </Text>
      <Text style={styles.bulletPoint}>1. Height (H) / Age (A)</Text>
      <Text style={styles.text}>
        The toddler's height is shorter than the standard height for the same age.
      </Text>
      <Text style={styles.bulletPoint}>2. Weight (W) / Height (H)</Text>
      <Text style={styles.text}>
        The toddler's weight is disproportionate to their height, often below the determined standard.
      </Text>
      <Text style={styles.bulletPoint}>3. Upper Arm Circumference (UAC)</Text>
      <Text style={styles.text}>
        The toddler's upper arm circumference is smaller than the standard size determined for their age.
      </Text>
      <Text style={styles.bulletPoint}>4. Health Conditions</Text>
      <Text style={styles.text}>
        Toddlers are more prone to infections and diseases due to a weakened immune system.
      </Text>
    </View>
  
    {/* Section: Stunting Treatment */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Stunting Treatment</Text>
      <Text style={styles.text}>
        Treating stunting caused by malnutrition in toddlers requires a comprehensive approach:
      </Text>
      <Text style={styles.bulletPoint}>1. Adequate Nutrition</Text>
      <Text style={styles.text}>- Exclusive breastfeeding for the first 6 months.</Text>
      <Text style={styles.text}>- Complementary feeding after 6 months.</Text>
      <Text style={styles.text}>- Balanced meals rich in protein, iron, vitamins, and minerals.</Text>
    </View>
  
    {/* Button */}
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>SAVE DATA</Text>
    </TouchableOpacity>
  </ScrollView>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5FF',
  },
  header: {
    backgroundColor: '#D8C6FF',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A2D82',
  },
  percentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5A2D82',
    marginVertical: 10,
  },
  riskLevel: {
    fontSize: 16,
    color: '#5A2D82',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A2D82',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A2D82',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#F39C12',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default StuntingRisk;
