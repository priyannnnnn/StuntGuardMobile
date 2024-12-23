import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  LineChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";

const HealthyFoodApp = () => {
  // Example chart data
  const chartData = [
    { day: "Mon", meals: 2 },
    { day: "Tue", meals: 1 },
    { day: "Wed", meals: 6 },
    { day: "Thu", meals: 3 },
    { day: "Fri", meals: 2 },
    { day: "Sat", meals: 5 },
    { day: "Sun", meals: 4 },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  return (
    <View style={styles.container}>
      <Text style={styles.levelText}>LVL 1</Text>
      <Text style={styles.title}>HEALTHY FOOD</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>MEALS EATEN</Text>
          <LineChart
            data={{
            labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
            datasets: [
                {
                data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                ]
                }
            ]
            }}
            width={Dimensions.get("window").width - 50} // from react-native
            height={220}
            yAxisLabel={"Rp"}
            chartConfig={{
            backgroundColor: "red",
            backgroundGradientFrom: "red",
            backgroundGradientTo: "red",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `white`,
            labelColor: (opacity = 1) => `white`,
            style: {
                borderRadius: 16
            }
            }}
            style={{
            marginVertical: 8,
            borderRadius: 16
            }}
          />
          
      </View>
      <View style={styles.information}>
        <Text style={styles.Text}>Eat Vegetables :{} exp</Text>
        <Text style={styles.Text}>Prental Exercise :{} exp</Text>
        <Text style={styles.Text}>Costum Vitamin : {} exp</Text>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8BBD0",
  },
  levelText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
  },
  progressBar: {
    marginVertical: 20,
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  Text:{
    fontSize:20,
    fontWeight:'600'
  },
  information:{
    padding:30,
    backgroundColor:'white',
    borderRadius:20
  }
});

export default HealthyFoodApp;
