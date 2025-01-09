import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, FlatList, Text } from 'react-native';
import { List, ActivityIndicator, Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const HealthyFoodApp = ({navigation}) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth().currentUser;
  
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to view data.');
        setLoading(false);
        return;
      }
  
      try {
        const snapshot = await database()
          .ref(`/users/${currentUser.uid}/daily`) // Path to the user's data
          .once('value'); // Fetch data once
  
        if (snapshot.exists()) {
          const rawData = snapshot.val(); // Raw data from the snapshot
          const data = Object.values(rawData)
            .map((item) => item.aggregatedResult)
            .filter(
              (result) =>
                result &&
                result.date &&
                result.protein &&
                result.carbs &&
                result.calories
            );
  
          console.log('data = ', data); // Filtered and usable data
          console.log('rawData = ', rawData); // Raw data
          setUserData(data); // Use filtered data for the UI
        } else {
          console.log('No data available');
          setUserData([]); // Set empty array if no data is available
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  if (loading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  const renderItem = ({ item }) => (
    <List.Item
      title={`Date: ${item.date}`}
      description={`Protein: ${item.protein}g, Carbs: ${item.carbs}g, Calories: ${item.calories}`}
      left={(props) => <List.Icon {...props} icon="calendar" />}
      style={styles.listItem}
    />
  );
  console.log("users data = ", userData)
  const proteinData = userData.map((item) => (item.protein ? parseFloat(item.protein) : 0));
  const carbData = userData.map((item) => (item.carbs ? parseFloat(item.carbs) : 0));
  const labels = userData.map((item) => (item.date ? item.date.slice(-5) : 'N/A'));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Daily Nutrition Records</Text>

      {userData.length > 0 && (
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: proteinData,
                color: () => '#FF6384', // Protein Line Color
                strokeWidth: 2,
              },
              {
                data: carbData,
                color: () => '#36A2EB', // Carbs Line Color
                strokeWidth: 2,
              },
            ],
            legend: ['Protein (g)', 'Carbs (g)'],
          }}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f7f7f7',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 8,
            },
          }}
          style={styles.chart}
        />
      )}

      <FlatList
        data={userData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        style={styles.list}
      />

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('Example') }
      >
        Add New Record
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    marginTop: 16,
    flex: 1,
  },
  listItem: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    padding: 8,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginVertical: 16,
    padding: 8,
  },
});

export default HealthyFoodApp;
