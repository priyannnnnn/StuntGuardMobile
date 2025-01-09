import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {
  LineChart,PieChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
// import firebase from './firebase';

function HomePage({navigation, route}){
  // const { score } = route.params;
  const score = route.params?.score ?? 0;

  const [data, setData] = useState([]);
  const [user, setUser] = useState([])
  const currentUser = auth().currentUser;
  const databaseUrl = 'https://supri-74ec7-default-rtdb.firebaseio.com'; // Replace with your Firebase database URL

  const getAccount = async() => {
    try{
      const idToken = await currentUser.getIdToken();
      // const url = `${databaseUrl}/users/${currentUser.uid}/daily/data.json?auth=${idToken}`;
      const url = `${databaseUrl}/users/${currentUser.uid}.json?auth=${idToken}`;

      const response = await axios.get(url)
      if (response.data) {
        setData(response.data)
        const { email, name, role } = response.data; // Destructure the required fields
      } else {
        console.log('No user data found.');
        Alert.alert('Info', 'No user data found.');
      }
    }catch(error){
      console.error(error)
    }
  }

  const showConfirmDialog = () => {
    return Alert.alert(
      "Do you want to Add?",
      "Do you want to Add Data?",
      [
        {
          text: "Control Data",
          onPress:()=>navigation.navigate('BabyForm'),
        },
        {
          text: "Immunization Data",
          onPress:()=>navigation.navigate('ImmunizationForm') ,
        },
      ]
    );
  }; 

  const fetchStuntingLevelsFromAPI = async () => {
    try { const idToken = await currentUser.getIdToken();
      const response = await fetch(`https://supri-74ec7-default-rtdb.firebaseio.com/users/data.json?auth=${idToken}`); // Replace with your Firebase API URL
      const data = await response.json();
  
      const stuntingLevels = {
        "High Risk": 0,
        "Moderate Risk": 0,
        "Low Risk": 0,
        "Unknown Risk": 0,
      };
  
      Object.values(data.users).forEach((user) => {
        if (user.data) {
          const records = Array.isArray(user.data) ? user.data : [user.data];
  
          records.forEach((record) => {
            if (record && record.stuntingLevel) {
              const level = record.stuntingLevel;
              if (stuntingLevels[level] !== undefined) {
                stuntingLevels[level]++;
              }
            }
          });
        }
      });
  
      console.log("Processed Stunting Levels:", stuntingLevels);
      return stuntingLevels;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  
  const NutritionScore = ({ score, label }) => (
    <View style={styles.nutritionItem}>
    <Svg height="60" width="60">
      {/* Background Circle */}
      <Circle cx="30" cy="30" r="28" stroke="#ccc" strokeWidth="4" fill="none" />
      {/* Dynamic Score Circle */}
      <Circle
        cx="30"
        cy="30"
        r="28"
        stroke="#d60000"
        strokeWidth="4"
        strokeDasharray={`${score * 10},100`}
        fill="none"
        rotation="270"
        origin="30,30"
      />
    </Svg>
    <Text style={styles.nutritionValue}>{score}/10</Text>
    <Text style={styles.nutritionLabel}>{label}</Text>
  </View>
  )

  const nutritionData = [
    { score: 3, label: 'proteins' },
    { score: 7, label: 'carbohydrate' },
    { score: 5, label: 'calories' },
  ];

  useEffect(() =>{
    getAccount()
  })
  return(
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('./image/Icon.png')} // Replace with your image URL
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.age}>10 Years</Text>
        </View>
        <TouchableOpacity style={styles.logIntakeButton} onPress={()=> navigation.navigate('Example')}>
          <Text style={styles.logIntakeText}>+ Catat Asupan</Text>
        </TouchableOpacity>
      </View>

      {/* Nutrition Section */}
      <View style={styles.nutritionSection}>
        <Text style={styles.sectionTitle}>You</Text>
        <View style={styles.nutritionRow}>
        
     <View style={styles.containert}>
      {nutritionData.map((item, index) => (
        <NutritionScore key={index} score={item.score} label={item.label} />
      ))}
    </View>
      </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <View style={styles.menuRow}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DataImunization')}>
            {/* <View style={styles.menuIcon} /> */}
            <Image source={require('./image/imunisasion.png')} style={styles.menuIcon}/>
            <Text style={styles.menuText}>immunization</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DataControl')}>
            {/* <View style={styles.menuIcon} /> */}
            <Image source={require('./image/kontrol.png')} style={styles.menuIcon}/>
            <Text style={styles.menuText}>control</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('StuntingRisk')}>
            {/* <View style={styles.menuIcon} /> */}
            <Image source={require('./image/tumbuh.png')} style={styles.menuIcon}/>
            <Text style={styles.menuText}>Grow</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Health Services */}
      <View style={styles.healthServices}>
        <Text style={styles.healthText}>
        Add Check data
        </Text>
        <TouchableOpacity style={styles.joinButton} onPress={showConfirmDialog}>
          <Text style={styles.joinButtonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinButton} onPress={()=> navigation.navigate('Chatbot')}>
          {/* <Text style={styles.joinButtonText}>Chat</Text> */}
          <Icon name="chat" size={17} color="#FEF9E1" />
        </TouchableOpacity>
      
        {/* <TouchableOpacity style={styles.joinButton} onPress={fetchStuntingLevelsFromAPI}>
          <Text style={styles.joinButtonText}>Add1</Text>
        </TouchableOpacity> */}
      </View>

      <Text style={styles.sectionTitle}>Risk Level</Text>
      <PieChart
        data={
            [
            {
                name: "moderate",
                population: 48.0,
                color: "orange",
                legendFontColor: "orange",
                legendFontSize: 11
            },
            {
                name: "High",
                population: 39.2,
                color: "red",
                legendFontColor: "black",
                legendFontSize: 11
            },
            {
                name: "Low",
                population: 34.2,
                color: "green",
                legendFontColor: "black",
                legendFontSize: 11
            },
          ]
        }
        width={Dimensions.get("window").width - 42} // from react-native
        height={180}
        chartConfig={{
            color: (opacity = 1) => `black`,
            labelColor: (opacity = 1) => `black`,
            style: {
                borderRadius: 16
            }
        }}
        backgroundColor="white"
        accessor="population"
        paddingLeft="15"
        absolute
        style={{
            marginVertical: 8,
            borderRadius: 16
        }}
    />
    <Text style={styles.sectionTitle}>Article</Text>
    <View style={styles.article}>
      <Image source={require('./image/stuntingg.png')} style={{height:90, width:120}}/>
      <View>
      <Text>tunting is a chronic .</Text>
      <Text>resulting from a nutritional ,</Text>
      <Text style={{color:'green'}}>See All</Text>
      </View>

    </View>
    <View style={{bottom:100}}>

    </View>
    </ScrollView>
  )
}
export default HomePage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0A8D0',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    padding:30,
    borderRadius:20,
    backgroundColor:'white'
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 14,
    color: '#777',
  },
  logIntakeButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderColor: '#d60000',
    borderWidth: 1,
  },
  logIntakeText: {
    color: '#d60000',
    fontWeight: 'bold',
  },
  nutritionSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menu: {
    marginBottom: 16,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuIcon: {
    width: 65,
    height: 60,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 4,
  },
  menuText: {
    fontSize: 16,
    fontWeight:'600'
  },
  healthServices: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    flexDirection:'row',
    alignContent:'center',
    textAlign:'center',

  },
  healthText: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft:60
  },
  joinButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft:30
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  containerr: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff', // White background for the whole container
    padding: 1,
    borderRadius: 20, // Make edges round like in the screenshot
    paddingHorizontal: 1,
  },
  nutritionItem: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical:0
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginLeft: 80,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#555', // Dark gray for labels
  },
  containert: {
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-between', // Space between items
    alignItems: 'center', // Center items vertically
    backgroundColor: '#fff', // White background
    padding: 5,
    borderRadius: 20, // Rounded edges for the container
  },
  nutritionItem: {
    alignItems: 'center', // Center text and circles
    marginHorizontal: 18, // Horizontal spacing between items
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginTop: 8, // Space between the circle and text
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#555', // Dark gray for labels
    marginTop: 4,
  },
  article:{
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    flexDirection:'row',
    alignContent:'center',
    textAlign:'center',
    marginBottom:100
  }
});