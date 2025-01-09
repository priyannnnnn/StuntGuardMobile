import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

function DailyTask({navigation}){
  const [data, setData] = useState([]);
  const [user, setUser] = useState([])
  const currentUser = auth().currentUser;
  const databaseUrl = 'https://supri-74ec7-default-rtdb.firebaseio.com'; // Replace with your Firebase database URL

  const [completedTasks, setCompletedTasks] = useState([]); // State to track completed tasks
  const [level, setLevel] = useState(1); 
  const [coins, setCoins] = useState(1); 
  const totalSteps = 8;

  const tasks = [
    { id: 1, title: 'EAT Protein', subtitle: '30 exp 5 coins', image: require('./image/protein.jpeg') },
    { id: 2, title: 'Eat Vegetables', subtitle: '30 exp 6 coins', image: require('./image/vegetables1.png') },
    { id: 3, title: 'Eat Fruit', subtitle: '30 exp 5 coins', image: require('./image/fruit1.png') },
  ];

  // const handleCheckBoxPress = (taskId) => {
  //   setCompletedTasks((prev) =>
  //     prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
  //   );
  // };

  // const handleCheckBoxPress = (taskId) => {
  //   setCompletedTasks((prev) => [...prev, taskId]); // Add the task to the array every time it's clicked
  // };
  const coinss = coins + 30
  const handleCheckBoxPress = (taskId) => {
    setCompletedTasks((prev) => {
      setCoins(coinss)
      const updatedTasks = [...prev, taskId];
      saveToDatabase(level, updatedTasks)
      // if (updatedTasks.length >= totalSteps) {
      //   // Level up when completed tasks reach the total steps
      //   setLevel((prevLevel) => prevLevel + 1);
      //   Alert.alert("Level Up!", `Congratulations! You've reached level ${level + 1}!`);
      //   return []; // Reset tasks after leveling up
      // }
      if (updatedTasks.length >= totalSteps) {
        // Level up when completed tasks reach the total steps
        const newLevel = level + 1;
        setLevel(newLevel);
        Alert.alert("Level Up!", `Congratulations! You've reached level ${newLevel}!`);
        saveToDatabase(newLevel, []); // Save the updated level and reset tasks in Firebase
        return []; // Reset tasks after leveling up
      }
      return updatedTasks;
    });
  };

  const saveToDatabase = async (currentLevel, currentTask)=>{
    const data = {
      currentLevel,
      currentTask
    }

    try{
      await database().ref(`/users/${currentUser.uid}/level`).set({data})
    }catch(error){
      console.error(error)
    }
  }

  const GetLevel = async() =>{
    try{
      const idToken = await currentUser.getIdToken();
      const url = `${databaseUrl}/users/${currentUser.uid}/level.json?auth=${idToken}`;
      const response = await axios.get(url)
      if (response.data) {
        const dataTask =  response.data.data.currentTask
        // console.log("current Task2 = ", response.data)
        // console.log("current Task3 = ", response.data.data.currentLevel)
        setLevel(response.data.data.currentLevel || 1);
        setCompletedTasks(dataTask || []);
      } else{
        console.error("err")
      }
    }catch(error){
      console.error(error)
    }
  }


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

  const fetchData = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to view data.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    try {
      // Get the user's ID token for authentication
      const idToken = await currentUser.getIdToken();

      // Build the URL for the specific data path
      const url = `${databaseUrl}/users/${currentUser.uid}/daily.json?auth=${idToken}`;

      // Make the GET request
      const response = await axios.get(url);
      if (response.data) {
        const fetchedData = response.data ? Object.values(response.data) : [];
        setData(fetchedData);
        // console.log("Fetch Data =", fetchedData)
      } else {
        console.log('No data found for this date.');
        Alert.alert('Info', 'No data found for today.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data.');
    }
  };
  // useEffect(()=> {
  //   getAccount()
  // },[])

  useEffect(() => {
    fetchData();
    getAccount();
    GetLevel();
    // console.log("data = ", completedTasks)
  }, []);

  return(
    <ScrollView style={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={require('./image/profile.png')} // Replace with the image URL
          style={styles.characterImage}
        />
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{data.name}</Text>
          <Text style={styles.profileStats}>{data.role}</Text>
          <Text style={styles.profileStats}>MINDFULNESS <Text style={styles.level}>LVL 1</Text></Text>
          <Text style={styles.profileStats}>VITAMIN {level}</Text>
          <Text style={styles.coins}>💰 {coins} COINS</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Text>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Tasks and Challenges Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={{fontWeight:'bold'}}>DAILY TASKS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activeTab} onPress={() => navigation.navigate('HealthyFoodApp')}>
          <Text style={{fontWeight:'bold'}}>CHALLENGES</Text>
        </TouchableOpacity>
        {/* <Text style={styles.inactiveTab}>CHALLENGES</Text> */}
      </View>

      {/* <View style={styles.progressBar}>
        {Array.from({ length: 8 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index < data.length ? styles.activeStep : styles.inactiveStep,
            ]}
          />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Example')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View> */}
        <View style={styles.progressBar}>
        {/* {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index < completedTasks.length ? styles.activeStep : styles.inactiveStep,
            ]}
          />
        ))} */}
        {/* {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index < completedTasks.length ? styles.activeStep : styles.inactiveStep,
            ]}
          />
        ))} */}
        {Array.from({ length: totalSteps }).map((_, index) => (
  <View
    key={index}
    style={[
      styles.progressStep,
      index < completedTasks.length ? styles.activeStep : styles.inactiveStep,
    ]}
  />
))}
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Example')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={{marginLeft:300, marginBottom:30}} onPress={()=>navigation.navigate('HealthyFoodApp')}>
        <Text>Show All</Text>
      </TouchableOpacity>


      {/* Task List */}
      {tasks.map((task) => (
        <TouchableOpacity key={task.id} style={styles.task}>
          <Image source={task.image} style={styles.taskIcon} />
          <View style={styles.taskDetails}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkBox,
              completedTasks.includes(task.id) && { backgroundColor: '#4caf50' }, // Change color if completed
            ]}
            onPress={() => handleCheckBoxPress(task.id)}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}
export default DailyTask;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0A8D0",
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  characterImage: {
    width: 80,
    height: 100,
    borderRadius: 30,
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileStats: {
    fontSize: 14,
    color: "#555",
    fontWeight:'bold'
  },
  level: {
    fontWeight: "bold",
  },
  coins: {
    fontSize: 14,
    marginTop: 8,
  },
  settingsButton: {
    padding: 8,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  activeTab: {
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  inactiveTab: {
    fontSize: 16,
    color: "#888",
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    padding: 8,
  },
  progressStep: {
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  addButton: {
    backgroundColor: "#000",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  task: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  taskIcon: {
    width: 45,
    height: 45,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginRight: 16,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskSubtitle: {
    fontSize: 14,
    color: "#888",
  },
  // checkBox: {
  //   width: 24,
  //   height: 24,
  //   borderWidth: 2,
  //   borderColor: "#888",
  //   borderRadius: 4,
  // },
  // progressStep: {
  //   width: 24,
  //   height: 24,
  //   borderRadius: 12,
  //   marginHorizontal: 4,
  // },
  // activeStep: {
  //   backgroundColor: "#4caf50", // Active step color (e.g., green)
  // },
  // inactiveStep: {
  //   backgroundColor: "#ddd", // Inactive step color (e.g., light gray)
  // },
  activeStep: {
    backgroundColor: "#4caf50", // Active step color (e.g., green)
  },
  inactiveStep: {
    backgroundColor: "#ddd", // Inactive step color (e.g., light gray)
  },
  // progressStep: {
  //   width: 40, // Adjust the size for a square
  //   height: 40,
  //   backgroundColor: "#fff",
  //   marginHorizontal: 4,
  // },
  // activeStep: {
  //   backgroundColor: "#4caf50", // Active step color (e.g., green)
  // },
  // inactiveStep: {
  //   backgroundColor: "#ddd", // Inactive step color (e.g., light gray)
  // },
  checkBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 4, // Retain the square shape
  },

  progressStep: {
    flex: 1, // Make each step occupy equal space
    height: 40, // Uniform height for squares
    backgroundColor: "#fff",
  },
  activeStep: {
    backgroundColor: "#4caf50", // Active step color (e.g., green)
  },
  inactiveStep: {
    backgroundColor: "#ddd", // Inactive step color (e.g., light gray)
  },
  progressContainer: {
    flexDirection: "row", // Align squares in a row
    width: "100%", // Full-width progress bar
  },
  
});