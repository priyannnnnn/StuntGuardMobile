import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// Comprehensive Nutritional Data for Indonesian Cuisine
const NUTRITIONAL_DATA = {
  protein: {
    chicken: { protein: 25, carbs: 1, calories: 150 },
    beef: { protein: 26, carbs: 0, calories: 250 },
    egg: { protein: 13, carbs: 1, calories: 155 },
    fish: { protein: 22, carbs: 0, calories: 206 },
    tofu: { protein: 8, carbs: 2, calories: 76 },
    tempeh: { protein: 19, carbs: 9, calories: 195 },
    shrimp: { protein: 24, carbs: 0, calories: 99 },
  },
  vegetables: {
    broccoli: { protein: 3, carbs: 6, calories: 35 },
    spinach: { protein: 2.9, carbs: 3.6, calories: 23 },
    carrot: { protein: 0.9, carbs: 10, calories: 41 },
    kale: { protein: 2.9, carbs: 4.4, calories: 49 },
    cucumber: { protein: 0.6, carbs: 3.6, calories: 16 },
    cabbage: { protein: 1.3, carbs: 5.8, calories: 25 },
    water_spinach: { protein: 2.6, carbs: 3.1, calories: 30 },
    eggplant: { protein: 1, carbs: 6, calories: 25 },
  },
  fruit: {
    banana: { protein: 1, carbs: 25, calories: 100 },
    apple: { protein: 0.5, carbs: 14, calories: 52 },
    orange: { protein: 1, carbs: 12, calories: 47 },
    grapes: { protein: 0.6, carbs: 18, calories: 69 },
    pineapple: { protein: 0.5, carbs: 13, calories: 50 },
    mango: { protein: 0.8, carbs: 15, calories: 60 },
    papaya: { protein: 0.5, carbs: 11, calories: 43 },
    guava: { protein: 2.6, carbs: 14, calories: 68 },
  },
};

export default function Example() {
  const [proteinInput, setProteinInput] = useState('');
  const [vegetablesInput, setVegetablesInput] = useState('');
  const [fruitInput, setFruitInput] = useState('');
  const [output, setOutput] = useState([]);

  const handleCalculate = async() => {
    const inputs = [
      { type: 'protein', name: proteinInput.toLowerCase() },
      { type: 'vegetables', name: vegetablesInput.toLowerCase() },
      { type: 'fruit', name: fruitInput.toLowerCase() },
    ];
  
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalCalories = 0;
  
    inputs.forEach(({ type, name }) => {
      if (NUTRITIONAL_DATA[type]?.[name]) {
        const { protein, carbs, calories } = NUTRITIONAL_DATA[type][name];
        totalProtein += protein;
        totalCarbs += carbs;
        totalCalories += calories;
      }
    });
  
    if (totalProtein === 0 && totalCarbs === 0 && totalCalories === 0) {
      alert('Please enter valid food names.');
      return;
    }
  
    const totalCalculatedCalories = totalProtein * 4 + totalCarbs * 4; // Assume no fat
    const proteinPercentage = ((totalProtein * 4) / totalCalculatedCalories) * 100;
    const carbsPercentage = ((totalCarbs * 4) / totalCalculatedCalories) * 100;
    const currentDate = new Date().toISOString().split('T')[0];

    const aggregatedResult = {
      id: Date.now().toString(),
      date: currentDate,
      foodType: `${proteinInput}, ${vegetablesInput}, ${fruitInput}`,
      protein: totalProtein.toFixed(2),
      carbs: totalCarbs.toFixed(2),
      calories: totalCalories.toFixed(2),
      proteinPercentage: proteinPercentage.toFixed(2),
      carbsPercentage: carbsPercentage.toFixed(2),
    };
  
    const currentUser = auth().currentUser;

    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to save data.');
      return;
    }

    try{
      await database().ref(`/users/${currentUser.uid}/daily/${currentDate}`).set({aggregatedResult})
    }catch(error){
      console.error(error)
    }
    setOutput([aggregatedResult]);
    console.log(aggregatedResult)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Calculator</Text>

      <Text style={styles.Text}>Protein</Text>
      <RNPickerSelect
        onValueChange={(text) => setProteinInput(text)}
        items={[
          { label: 'chicken', value: 'chicken' },
          { label: 'beef', value: 'beef' },
          { label: 'egg', value: 'egg' },
          { label: 'fish', value: 'fish' },
          { label: 'tofu', value: 'tofu' },
          { label: 'tempeh', value: 'tempeh' },
          { label: 'shrimp', value: 'shrimp' },
        ]}
        style={{
          inputIOS: styles.input1,
          inputAndroid: styles.input1,
          placeholder: styles.placeholder,
        }}
        placeholder={{ label: 'Protein (e.g., chicken, beef, egg)', value: proteinInput, color: 'gray' }}
        useNativeAndroidPickerStyle={false}
        // Icon={() => <MaterialIcons name="house" size={24} color="gray" />}
      />

      <Text style={styles.Text}>vegetables</Text>
       <RNPickerSelect
        onValueChange={(text) =>  setVegetablesInput(text)}
        items={[
          { label: 'broccoli', value: 'broccoli' },
          { label: 'spinach', value: 'spinach' },
          { label: 'carrot', value: 'carrot' },
          { label: 'kale', value: 'kale' },
          { label: 'cucumber', value: 'cucumber' },
          { label: 'cabbage', value: 'cabbage' },
          { label: 'water_spinach', value: 'water_spinach' },
          { label: 'eggplant', value: 'eggplant' },
        ]}
        style={{
          inputIOS: styles.input1,
          inputAndroid: styles.input1,
          placeholder: styles.placeholder,
        }}
        placeholder={{ label: 'Vegetables (e.g., broccoli, spinach)', value: vegetablesInput, color: 'gray' }}
        useNativeAndroidPickerStyle={false}
        // Icon={() => <MaterialIcons name="house" size={24} color="gray" />}
      />
      <Text style={styles.Text}>Fruit</Text>
       <RNPickerSelect
        onValueChange={(text) =>  setFruitInput(text)}
        items={[
          { label: 'banana', value: 'banana' },
          { label: 'apple', value: 'apple' },
          { label: 'orange', value: 'orange' },
          { label: 'grapes', value: 'grapes' },
          { label: 'pineapple', value: 'pineapple' },
          { label: 'mango', value: 'mango' },
          { label: 'papaya', value: 'papaya' },
          { label: 'guava', value: 'guava' },
        ]}
        style={{
          inputIOS: styles.input1,
          inputAndroid: styles.input1,
          placeholder: styles.placeholder,
        }}
        placeholder={{ label: 'Fruit (e.g., banana, apple)', value: fruitInput, color: 'gray' }}
        useNativeAndroidPickerStyle={false}
        // Icon={() => <MaterialIcons name="house" size={24} color="gray" />}
      />

      <Button title="Calculate" onPress={handleCalculate} />

      {/* Output Section */}
      <FlatList
        data={output}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.outputItem}>
            <Text>Food: {item.foodType}</Text>
            <Text>Protein: {item.protein} g</Text>
            <Text>Carbs: {item.carbs} g</Text>
            <Text>Calories: {item.calories} kcal</Text>
            <Text>Protein %: {item.proteinPercentage}%</Text>
            <Text>Carbs %: {item.carbsPercentage}%</Text>
            <Text>Date %: {item.date}%</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8d8eb',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  outputItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  input1: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
    color: 'black',
  },
  placeholder: {
    color: 'gray',
    fontSize: 16,
  },
  Text:{
    fontSize: 25,
    fontWeight:'700',
    
  }
});
