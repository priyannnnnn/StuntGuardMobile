import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from "axios";
import database from '@react-native-firebase/database';
import auth from "@react-native-firebase/auth";

const data = [
  { no: 1, name: "Siti Aminah", tb: 160, bb: 55, sistol: 110, diastol: 70, lila: 26, hb: 12, status: "Normal" },
  { no: 2, name: "Dewi Sartika", tb: 155, bb: 60, sistol: 120, diastol: 80, lila: 27, hb: 13, status: "Ringan" },
  { no: 3, name: "Rina Susanti", tb: 165, bb: 65, sistol: 115, diastol: 75, lila: 28, hb: 14, status: "Normal" },
  { no: 4, name: "Ani Wijaya", tb: 155, bb: 50, sistol: 105, diastol: 65, lila: 25, hb: 11, status: "Sedang" },
  { no: 5, name: "Susi Andayani", tb: 162, bb: 58, sistol: 112, diastol: 72, lila: 26.5, hb: 13.5, status: "Normal" },
  { no: 6, name: "Rina Kurniawati", tb: 167, bb: 68, sistol: 118, diastol: 78, lila: 29, hb: 14.2, status: "Normal" },
  { no: 7, name: "Wati Nurhaliza", tb: 159, bb: 54, sistol: 110, diastol: 70, lila: 26.2, hb: 12.5, status: "Ringan" },
  { no: 8, name: "Nia Lestari", tb: 161, bb: 62, sistol: 116, diastol: 76, lila: 27.5, hb: 13.8, status: "Normal" },
  { no: 9, name: "Dwi Aprilia", tb: 157, bb: 57, sistol: 108, diastol: 68, lila: 25.8, hb: 12.2, status: "Ringan" },
  { no: 10, name: "Intan Maulida", tb: 164, bb: 64, sistol: 120, diastol: 80, lila: 28.3, hb: 14.5, status: "Normal" },
];

const DataControl = ({navigation}) => {
  const [dataa, setData] = useState([]);
  const currentUser = auth().currentUser;
  const databaseUrl = 'https://supri-74ec7-default-rtdb.firebaseio.com'; // Replace with your Firebase database URL
  const [users, setUsers] = useState([]);
  const [stuntingLevels, setStuntingLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    console.log(currentUser.uid)
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to view data.');
      return;
    }
  
    try {
      const uid = currentUser.uid;

      if (!uid) {
        throw new Error('User ID is invalid or empty.');
      }
  
      console.log(`Fetching data for user UID: ${uid}`);
  
      // Access the correct path in the database
      const snapshot = await database().ref(`/users/${uid}/data`).once('value');
  
      if (snapshot.exists()) {
        const responseData = snapshot.val();
  
        // Normalize data into an array format
        const fetchedData = Object.keys(responseData).map((key) => ({
          id: key,
          ...responseData[key],
        }));
  
        console.log('Fetched Data:', fetchedData);
        setData(fetchedData);
      } else {
        console.log('No data found for this date.');
        Alert.alert('Info', 'No data found for today.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data.');
    }
  };

  const UpdateandDelete = (item) => {
    console.log("testt")
    console.log("item = ", item.id)
    Alert.alert(
      "Choose Action",
      `What do you want to do with ${item.name}'s data?`,
      [
        {
          text: "Update",
          onPress: () => navigation.navigate('UpdateDataControl',{item}), // Pass item to update function
        },
        {
          text: "Delete",
          onPress: () => Delete(item), // Pass item to delete function
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const Delete = async(item)=> {
    console.log("Delete = ", item.id)
    try{
      await database()
    .ref(`/users/${currentUser.uid}/data/${item.id}`).remove()
    console.log('Data succesfully')
    fetchData()
    }catch(error){
      console.error(error)
    }
  }
  const ex = async(item)=>{
    try{
      const snapshot = await database()
      .ref(`/users/${currentUser.uid}/data/${item.id}/stuntingPercentahe`)
      .once('value');
      console.log("data stunting = ", snapshot)
    }catch(err){
      console.error(err)
    }
  }

  const GetAllData = async(item) => {
    console.log(item.id)
    try {
      const currentUser = auth().currentUser;

      if (!currentUser) {
        throw new Error("User not logged in");
      }

      // Fetch users if admin
      const adminClaim = (await currentUser.getIdTokenResult()).claims.isAdmin;
      if (adminClaim) {
        database()
          .ref("/users")
          .once("value")
          .then(snapshot => {
            const usersData = snapshot.val();
            if (usersData) {
              setUsers(Object.entries(usersData).map(([key, value]) => ({ id: key, ...value })));
            }
          });
      }

      // Fetch stunting levels
      database()
        .ref("/stuntingLevels")
        .once("value")
        .then(snapshot => {
          const stuntingData = snapshot.val();
          if (stuntingData) {
            setStuntingLevels(Object.entries(stuntingData).map(([key, value]) => ({ id: key, ...value })));
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() =>{
    fetchData()
    // ex()
  },[])

  // useEffect(() => {
  //   console.log("Updated dataa:", dataa);
  // }, [dataa]);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.tableHeader}>
        {/* <Text style={styles.headerText}>No</Text> */}
        <Text style={styles.headerText}>Nama</Text>
        <Text style={styles.headerText}>TB</Text>
        <Text style={styles.headerText}>BB</Text>
        <Text style={styles.headerText}>HScore</Text>
        <Text style={styles.headerText}>WAge</Text>
        {/* <Text style={styles.headerText}>WHeight</Text>
        <Text style={styles.headerText}>WZScore</Text> */}
        <Text style={styles.headerText}>Level</Text>
        <Text style={styles.headerText}>Stunt%</Text>
        <Text style={styles.headerText}>info</Text>
      </View>

      {/* Data Rows */}
      <ScrollView>
  {dataa.map((item, index) => (
    <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.rowEven]}>
      {/* <Text style={styles.cell}>{item.no}</Text> */}
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.height}</Text>
      <Text style={styles.cell}>{item.weight}</Text>
      <Text style={styles.cell}>{item.heightZScore}</Text>
      {/* <Text style={styles.cell}>{item.weightForAge}</Text>
      <Text style={styles.cell}>{item.weightForHeight}</Text> */}
      <Text style={styles.cell}>{item.stuntingLevel}</Text>
      <Text style={styles.cell}>{item.infectionCheck}</Text>
      <Text style={styles.cell}>{item.stuntingPercentage}%</Text>
      <TouchableOpacity 
        onPress={() => UpdateandDelete(item)} 
        style={styles.infoButton}>
          <Text style={styles.infoButtonText}>U&D</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity 
        onPress={GetAllData} 
        style={styles.deleteButton}>
          <Text style={styles.infoButtonTextDelete}>All</Text>
      </TouchableOpacity> */}
    </View>
  ))}
</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5FF',
    padding: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#A28BE7',
    padding: 10,
    borderRadius: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#213555',
  },
  rowEven: {
    backgroundColor: '#F8F6FF',
  },
  cell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    color: '#5DB996',
  },
  infoButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8C6FF',
    borderRadius: 0,
    flexDirection: 'row',
  },
  deleteButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFCDD2', // Different background color for delete
    borderRadius: 0,
    flexDirection: 'row',
  },
  infoButtonText: {
    color: '#5A2D82',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoButtonTextDelete: {
    color: '#C30E59',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DataControl;
