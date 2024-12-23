import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default function PregnantWomanData({route, navigation}) {

  const [role, setRole] = useState('');
  // const {role} = route.params; 
  const [data, setData] = useState({
    // status: role,
    name: '',
    height: '',
    systolicBP: '',
    armCircumference: '',
    weight: '',
    diastolicBP: '',
    hemoglobin: '',
    nutritionalStatus: '',
    iron: '',
    bloodSugar: '',
    hbsAg: '',
    counseling: '',
    urineProtein: '',
    syphilis: '',
    thalassemia: '',
    infectiousDiseases: ''
  })

  const handleSaveData = async () => {
    const currentUser = auth().currentUser;
    console.log("users = ", currentUser.uid)
    console.log("data = ", data.name)

    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to save data.');
      return;
    }

    try {
      // Save to Firebase Realtime Database
      await database().ref(`/users/${currentUser.uid}/data`).set({
        // status: data.status,
        name: data.name,
        height: data.height,
        systolicBP: data.systolicBP,
        armCircumference: data.armCircumference,
        weight: data.weight,
        diastolicBP: data.diastolicBP,
        hemoglobin: data.hemoglobin,
        nutritionalStatus: data.nutritionalStatus,
        iron: data.iron,
        bloodSugar: data.bloodSugar,
        hbsAg: data.hbsAg,
        counseling: data.counseling,
        urineProtein: data.urineProtein,
        syphilis: data.syphilis,
        thalassemia: data.thalassemia,
        infectiousDiseases: data.infectiousDiseases
      });
      Alert.alert('Success', 'Data saved successfully!');
    } catch (error) {
      console.error(error.message)
      Alert.alert('Error', error.message);
    }
  };

  const handleInputChange = (key, value) => {
    setData({ ...data, [key]: value });
  };
  
  const onSubmit =()=>{
    navigation.navigate('Main')
  }
  useEffect(() => {
    const fetchRole = async () => {
      const currentUser = auth().currentUser;
      const snapshot = await database().ref(`/users/${currentUser.uid}/role`).once('value');
      console.log(snapshot)
      setRole(snapshot.val());
    };

    fetchRole();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.Text}>
        <Text style={styles.title}>Data Ibu Hamil</Text>
      </View>
      
      <TextInput style={styles.input} placeholder="Nama Ibu Hamil" onChangeText={(val) => handleInputChange('name', val)}/>

      <Text style={styles.sectionTitle}>Data Wajib</Text>
      <TextInput style={styles.input} placeholder="Tinggi Badan (TB)" onChangeText={(val) => handleInputChange('height', val)}/>
      <TextInput style={styles.input} placeholder="Tekanan Darah Sistolik (TD Sistol)" onChangeText={(val) => handleInputChange('systolicBP', val)}/>
      <TextInput style={styles.input} placeholder="Lingkar Lengan Atas (LILA)" onChangeText={(val) => handleInputChange('armCircumference', val)}/>
      <TextInput style={styles.input} placeholder="Berat Badan (BB)" onChangeText={(val) => handleInputChange('weight', val)}/>
      <TextInput style={styles.input} placeholder="Tekanan Darah Diastolik (TD Diastol)" onChangeText={(val) => handleInputChange('diastolicBP', val)}/>
      <TextInput style={styles.input} placeholder="Hemoglobni (HB)" onChangeText={(val) => handleInputChange('hemoglobin', val)}/>

      <Text style={styles.sectionTitle}>Data Tambahan</Text>
      <TextInput style={styles.input} placeholder="Status Gizi" onChangeText={(val) => handleInputChange('nutritionalStatus', val)}/>
      <TextInput style={styles.input} placeholder="Suplemen Zat Besi (Fe)" onChangeText={(val) => handleInputChange('iron', val)}/>
      <TextInput style={styles.input} placeholder="Cek Gula Darah" onChangeText={(val) => handleInputChange('bloodSugar', val)}/>
      <TextInput style={styles.input} placeholder="Cek HBsAG" onChangeText={(val) => handleInputChange('hbsAg', val)}/>
      <TextInput style={styles.input} placeholder="Konseling" onChangeText={(val) => handleInputChange('counseling', val)}/>
      <TextInput style={styles.input} placeholder="Pemeriksaaan Protein Urin " onChangeText={(val) => handleInputChange('urineProtein', val)}/>
      <TextInput style={styles.input} placeholder="Cek Sifilis" onChangeText={(val) => handleInputChange('syphilis', val)}/>
      <TextInput style={styles.input} placeholder="Cek Talasemia" onChangeText={(val) => handleInputChange('thalassemia', val)}/>
      <TextInput style={styles.input} placeholder="Pemeriksaan Infeksi Menular Lainnya" onChangeText={(val) => handleInputChange('infectiousDiseases', val)}/>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleSaveData}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBDDFB",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  Text:{
    alignItems:'center',
    textAlign:'center',
    justifyContent:'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#6A1B9A",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#DDD",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#FF7EB6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
});
