import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';

function GetAllData(){
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://supri-1cabb-default-rtdb.asia-southeast1.firebasedatabase.app/data.json'
        );
        const fetchedData = response.data ? Object.values(response.data) : [];
        setData(fetchedData);
        console.log('Fetched Data =', fetchedData);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Gagal mengambil data dari Firebase!');
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.label}>Buah-buahan: <Text style={styles.value}>{item.buahBuahan}</Text></Text>
      <Text style={styles.label}>Makanan: <Text style={styles.value}>{item.makanan}</Text></Text>
      <Text style={styles.label}>Porsi: <Text style={styles.value}>{item.porsi}</Text></Text>
      <Text style={styles.label}>Sayuran: <Text style={styles.value}>{item.sayuran}</Text></Text>
      <Text style={styles.label}>Score: <Text style={styles.value}>{item.score}</Text></Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Data Food EveryDay</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
export default GetAllData;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8d8eb',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontWeight: '400',
  },
});