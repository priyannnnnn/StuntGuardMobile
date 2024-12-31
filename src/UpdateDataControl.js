import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';

function UpdateDataControl({ route, navigation }) {

  const [showDatePicker, setShowDatePicker] = useState(false);
  const {item} = route.params;
  const currentUser = auth().currentUser;
  const [date, setDate] = useState(new Date()); // State to manage selected date

  const [data, setData] = useState({
    name: '',
    age:'',
    height: '',
    weight: '',
    heightForAge: '',
    weightForAge: '',
    heightZScore: '',
    weightZScore: '',
    weightForHeight: '',
    weightGain: '',
    midUpperArmCircumference: '',
    infectionCheck: '',
    birthDate: '', 
  });

  const calculateStuntingLevel = (data) => {
    const {
      height,
      weight,
      heightForAge,
      weightForAge,
      heightZScore,
      weightZScore,
      weightForHeight,
    } = data;

    // Parse values and ensure they are numeric
    const scores = [
      parseFloat(height) || 0,
      parseFloat(weight) || 0,
      parseFloat(heightForAge) || 0,
      parseFloat(weightForAge) || 0,
      parseFloat(heightZScore) || 0,
      parseFloat(weightZScore) || 0,
      parseFloat(weightForHeight) || 0,
    ];

    // Calculate the mean score
    const total = scores.reduce((sum, value) => sum + value, 0);
    const meanScore = total / scores.length;

    // Determine stunting level based on the mean score
    let stuntingLevel = '';
    let stuntingPercentage = 0;

    if (meanScore >= 10 && meanScore < 40) {
      stuntingLevel = 'High Risk';
      stuntingPercentage = ((40 - meanScore) / 30) * 100; // Map meanScore to 0-100%
    } else if (meanScore >= 40 && meanScore < 70) {
      stuntingLevel = 'Moderate Risk';
      stuntingPercentage = ((70 - meanScore) / 30) * 100; // Map meanScore to 0-100%
    } else if (meanScore >= 70 && meanScore <= 100) {
      stuntingLevel = 'Low Risk';
      stuntingPercentage = ((meanScore - 70) / 30) * 100; // Map meanScore to 0-100%
    } else {
      stuntingLevel = 'Unknown Risk';
      stuntingPercentage = 0;
    }

    return { stuntingLevel, stuntingPercentage: Math.round(stuntingPercentage) };
  };
  
  const onSubmit = async () => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to save data.');
      return;
    }
    const itemId = item?.id; 

    const { stuntingLevel, stuntingPercentage } = calculateStuntingLevel(data);

    try {
      const sequenceRef = database().ref(`/sequence`);
      const sequenceSnapshot = await sequenceRef.once('value');
      let currentSequence = sequenceSnapshot.val() || 0;

      // Increment the sequence
      currentSequence += 1;

      // Save the updated sequence back to the database
      await sequenceRef.set(currentSequence);

      await database()
        .ref(`/users/${currentUser.uid}/data/${itemId}`)
        .update({
          ...data, // Use the updated data object
          stuntingLevel,
          stuntingPercentage,
        });

      Alert.alert(
        'Prediction',
        `Stunting Risk Level: ${stuntingLevel}\nIndication of Stunting: ${stuntingPercentage}%`
      );
      navigation.navigate('DataControl');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  const getData = async()=>{
    console.log("item update = ", item.id)
    const uid = currentUser.uid;
    try{
      const snapshot = await database()
      .ref(`/users/${currentUser.uid}/data/${item.id}`)
      .once('value');
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Fetched data by ID:', data);
      // return data; // Return the data
      setData({
        name:`${data.name}`,
        age: `${data.age}`,
        height: `${data.height}`,
        weight: `${data.weight}`,
        heightForAge: `${data.heightForAge}`,
        weightForAge: `${data.weightForAge}`,
        heightZScore: `${data.heightZScore}`,
        weightForHeight: `${data.weightForHeight}`,
        weightZScore: `${data.weightZScore}`,
        weightGain: `${data.weightGain}`,
        midUpperArmCircumference: `${data.midUpperArmCircumference}`,
        infectionCheck: `${data.infectionCheck}`,
        birthDate: `${data.birthDate}`
      })
    } else {
      console.log('No data found for this ID.');
      return null;
    }
    }catch(err){
      console.log(err)
    }
  }

  const handleInputChange = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setData({ ...data, birthDate: formattedDate });
    }
    setShowDatePicker(false);
  };

  useEffect(() => {
    console.log("item Update = ", item.id)
    // Any initialization logic can go here
    getData()
  }, []);

  return (
    <View style={styles.container}>
    <ScrollView>
      <View style={styles.section}>
        <Text style={styles.twoheader}>Update Data</Text>
        <TextInput
          style={styles.input}
          placeholder="Toddler Name"
          onChangeText={(val) => handleInputChange('name', val)}
          value={data.name}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          onChangeText={(val) => handleInputChange('age', val)}
          value={data.birthDate}
        />
      </View>
  
      <View style={styles.section}>
        <Text style={styles.header}>Mandatory Data</Text>
        <TextInput
          style={styles.input}
          placeholder="Height (H)"
          onChangeText={(val) => handleInputChange('height', val)}
          value={data.height}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (W)"
          onChangeText={(val) => handleInputChange('weight', val)}
          value={data.weight}
        />
        <TextInput
          style={styles.input}
          placeholder="Height for Age (H/A)"
          onChangeText={(val) => handleInputChange('heightForAge', val)}
          value={data.heightForAge}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight for Age (W/A)"
          onChangeText={(val) => handleInputChange('weightForAge', val)}
          value={data.weightForAge}
        />
        <TextInput
          style={styles.input}
          placeholder="Height Z-Score (ZS H/A)"
          onChangeText={(val) => handleInputChange('heightZScore', val)}
          value={data.heightZScore}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight Z-Score (ZS W/A)"
          onChangeText={(val) => handleInputChange('weightZScore', val)}
          value={data.weightZScore}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight for Height (W/H)"
          onChangeText={(val) => handleInputChange('weightForHeight', val)}
          value={data.weightForHeight}
        />
      </View>
  
      <View style={styles.section}>
        <Text style={styles.header}>Additional Data</Text>
        <TextInput
          style={styles.input}
          placeholder="Weight Gain"
          onChangeText={(val) => handleInputChange('weightGain', val)}
          value={data.weightGain}
        />
        <TextInput
          style={styles.input}
          placeholder="Mid-Upper Arm Circumference"
          onChangeText={(val) => handleInputChange('midUpperArmCircumference', val)}
          value={data.midUpperArmCircumference}
        />
        <TextInput
          style={styles.input}
          placeholder="Infectious Disease Check"
          onChangeText={(val) => handleInputChange('infectionCheck', val)}
          value={data.infectionCheck}
        />
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{data.birthDate || 'Date of Birth (Press to Select)'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </View>
    </ScrollView>
    <TouchableOpacity style={styles.button} onPress={onSubmit}>
      <Text style={styles.buttonText}>STUNTING DETECTION</Text>
    </TouchableOpacity>
  </View>
  
  );
}

export default UpdateDataControl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8BBD0',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5f2994',
    marginBottom: 10,
  },
  twoheader: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#5f2994',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#5CB338',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d3c4e3',
  },
  button: {
    backgroundColor: '#f8a6ff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5f2994',
  },
});
