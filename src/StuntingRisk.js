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
        <Text style={styles.headerTitle}>Risiko Stunting</Text>
        <Text style={styles.percentage}>{data.stuntingPercentage}%</Text>
        <Text style={styles.riskLevel}>Risiko Stunting {data.stuntingLevel}</Text>
      </View>

      {/* Section: Rincian Stunting */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rincian Stunting</Text>
        <Text style={styles.subtitle}>Kekurangan Gizi pada Balita</Text>
        <Text style={styles.text}>
          Kekurangan gizi adalah penyebab utama stunting pada balita. Berikut adalah rincian penyebabnya:
        </Text>
        <Text style={styles.bulletPoint}>1. Tinggi Badan (TB) / Usia (U)</Text>
        <Text style={styles.text}>Tinggi badan balita lebih pendek dari standar tinggi badan untuk usia yang sama.</Text>
        <Text style={styles.bulletPoint}>2. Berat Badan (BB) / Tinggi Badan (TB)</Text>
        <Text style={styles.text}>
          Berat badan balita tidak sebanding dengan tinggi badannya, seringkali berada di bawah standar yang ditentukan.
        </Text>
        <Text style={styles.bulletPoint}>3. Lingkar Lengan Atas (LILA)</Text>
        <Text style={styles.text}>
          Lingkar lengan atas balita lebih kecil dari ukuran standar yang ditentukan untuk usia tertentu.
        </Text>
        <Text style={styles.bulletPoint}>4. Kondisi Kesehatan</Text>
        <Text style={styles.text}>
          Balita lebih rentan terhadap infeksi dan penyakit karena sistem kekebalan tubuh yang lemah.
        </Text>
      </View>

      {/* Section: Penanganan Stunting */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Penanganan Stunting</Text>
        <Text style={styles.text}>
          Penanganan stunting yang disebabkan oleh kekurangan gizi pada balita memerlukan pendekatan yang komprehensif:
        </Text>
        <Text style={styles.bulletPoint}>1. Nutrisi yang Adekuat</Text>
        <Text style={styles.text}>- ASI Eksklusif selama 6 bulan pertama.</Text>
        <Text style={styles.text}>- MP-ASI setelah 6 bulan.</Text>
        <Text style={styles.text}>- Makanan seimbang kaya protein, zat besi, vitamin, dan mineral.</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>SIMPAN DATA</Text>
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
