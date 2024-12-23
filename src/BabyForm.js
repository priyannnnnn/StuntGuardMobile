import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';

function BabyForm({ route, navigation }) {

  const [showDatePicker, setShowDatePicker] = useState(false);
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
        .ref(`/users/${currentUser.uid}/data/${currentSequence}`)
        .set({
          ...data,
          stuntingLevel,
          stuntingPercentage,
        });

      Alert.alert(
        'Prediction',
        `Stunting Risk Level: ${stuntingLevel}\nIndication of Stunting: ${stuntingPercentage}%`
      );
      navigation.navigate('HomePage');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save data.');
    }
  };

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
    // Any initialization logic can go here
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.twoheader}>Data Balita</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama Balita"
            onChangeText={(val) => handleInputChange('name', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            onChangeText={(val) => handleInputChange('age', val)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>Data Wajib</Text>
          <TextInput
            style={styles.input}
            placeholder="Tinggi Badan (TB)"
            onChangeText={(val) => handleInputChange('height', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Berat Badan (BB)"
            onChangeText={(val) => handleInputChange('weight', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Tinggi Badan Per Umur (TB/U)"
            onChangeText={(val) => handleInputChange('heightForAge', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Berat Badan Per Umur (BB/U)"
            onChangeText={(val) => handleInputChange('weightForAge', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Z-Score Tinggi Badan (ZS TB/U)"
            onChangeText={(val) => handleInputChange('heightZScore', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Z-Score Berat Badan (ZS BB/U)"
            onChangeText={(val) => handleInputChange('weightZScore', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Berat Badan Per Tinggi Badan (BB/TB)"
            onChangeText={(val) => handleInputChange('weightForHeight', val)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>Data Tambahan</Text>
          <TextInput
            style={styles.input}
            placeholder="Peningkatan Berat Badan"
            onChangeText={(val) => handleInputChange('weightGain', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Lingkar Lengan Atas"
            onChangeText={(val) => handleInputChange('midUpperArmCircumference', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Pemeriksaan Infeksi Menular"
            onChangeText={(val) => handleInputChange('infectionCheck', val)}
          />
           <TouchableOpacity
            style={[styles.input, { justifyContent: 'center' }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{data.birthDate || 'Tanggal Lahir (Press to Select)'}</Text>
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
        <Text style={styles.buttonText}>DETEKSI STUNTING</Text>
      </TouchableOpacity>
    </View>
  );
}

export default BabyForm;

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
