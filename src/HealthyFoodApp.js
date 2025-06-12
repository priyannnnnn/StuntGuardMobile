"use client"

import { useEffect, useState } from "react"
import { View, StyleSheet, Alert, FlatList, Text } from "react-native"
import { ActivityIndicator, Button } from "react-native-paper"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

const HealthyFoodApp = ({ navigation }) => {
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth().currentUser

      if (!currentUser) {
        Alert.alert("Error", "You must be logged in to view data.")
        setLoading(false)
        return
      }

      try {
        const snapshot = await database().ref(`/users/${currentUser.uid}/daily`).once("value")

        if (snapshot.exists()) {
          const rawData = snapshot.val()
          const data = Object.values(rawData)
            .map((item) => item.aggregatedResult)
            .filter((result) => result && result.date && result.protein && result.carbs && result.calories)

          console.log("data = ", data)
          console.log("rawData = ", rawData)
          setUserData(data)
        } else {
          console.log("No data available")
          setUserData([])
        }
      } catch (error) {
        console.error(error)
        Alert.alert("Error", "Failed to fetch data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading your nutrition data...</Text>
      </View>
    )
  }

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.nutritionRow}>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionLabel}>Protein</Text>
          <Text style={styles.nutritionValue}>{item.protein}g</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionLabel}>Carbs</Text>
          <Text style={styles.nutritionValue}>{item.carbs}g</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionLabel}>Calories</Text>
          <Text style={styles.nutritionValue}>{item.calories}</Text>
        </View>
      </View>
    </View>
  )

  console.log("users data = ", userData)
  const proteinData = userData.map((item) => (item.protein ? Number.parseFloat(item.protein) : 0))
  const carbData = userData.map((item) => (item.carbs ? Number.parseFloat(item.carbs) : 0))
  const labels = userData.map((item) => (item.date ? item.date.slice(-5) : "N/A"))

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Nutrition Dashboard</Text>
        <Text style={styles.subHeader}>Track your daily progress</Text>
      </View>

      {userData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weekly Progress</Text>
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: proteinData,
                  color: () => "#4A90E2", // Soft blue for protein
                  strokeWidth: 3,
                },
                {
                  data: carbData,
                  color: () => "#7ED321", // Soft green for carbs
                  strokeWidth: 3,
                },
              ],
              legend: ["Protein (g)", "Carbs (g)"],
            }}
            width={Dimensions.get("window").width - 48}
            height={220}
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#F8FAFB",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(60, 60, 67, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#FFFFFF",
              },
              propsForBackgroundLines: {
                strokeDasharray: "",
                stroke: "#E5E5EA",
                strokeWidth: 1,
              },
            }}
            style={styles.chart}
            bezier
          />
        </View>
      )}

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Recent Records</Text>
        <FlatList
          data={userData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={() => navigation.navigate("Example")}
      >
        Add New Record
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFB",
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1D1D1F",
    textAlign: "center",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    fontWeight: "400",
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 12,
    marginLeft: 4,
  },
  list: {
    flex: 1,
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  listItemHeader: {
    marginBottom: 12,
  },
  dateContainer: {
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nutritionItem: {
    alignItems: "center",
    flex: 1,
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1D1D1F",
  },
  button: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFB",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
})

export default HealthyFoodApp
