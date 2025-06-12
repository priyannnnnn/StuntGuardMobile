"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from "react-native"
import { Svg, Circle } from "react-native-svg"
import auth from "@react-native-firebase/auth"
import axios from "axios"
import { PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import Icon from "react-native-vector-icons/Entypo"

function HomePage({ navigation, route }) {
  const score = route.params?.score ?? 0

  const [data, setData] = useState([])
  const [user, setUser] = useState([])
  const currentUser = auth().currentUser
  const databaseUrl = "https://supri-74ec7-default-rtdb.firebaseio.com"

  const getAccount = async () => {
    try {
      const idToken = await currentUser.getIdToken()
      const url = `${databaseUrl}/users/${currentUser.uid}.json?auth=${idToken}`

      const response = await axios.get(url)
      if (response.data) {
        setData(response.data)
        const { email, name, role } = response.data
      } else {
        console.log("No user data found.")
        Alert.alert("Info", "No user data found.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const showConfirmDialog = () => {
    return Alert.alert("Add Health Data", "What type of data would you like to add?", [
      {
        text: "Control Data",
        onPress: () => navigation.navigate("BabyForm"),
      },
      {
        text: "Immunization Data",
        onPress: () => navigation.navigate("ImmunizationForm"),
      },
    ])
  }

  const fetchStuntingLevelsFromAPI = async () => {
    try {
      const idToken = await currentUser.getIdToken()
      const response = await fetch(`https://supri-74ec7-default-rtdb.firebaseio.com/users/data.json?auth=${idToken}`)
      const data = await response.json()

      const stuntingLevels = {
        "High Risk": 0,
        "Moderate Risk": 0,
        "Low Risk": 0,
        "Unknown Risk": 0,
      }

      Object.values(data.users).forEach((user) => {
        if (user.data) {
          const records = Array.isArray(user.data) ? user.data : [user.data]

          records.forEach((record) => {
            if (record && record.stuntingLevel) {
              const level = record.stuntingLevel
              if (stuntingLevels[level] !== undefined) {
                stuntingLevels[level]++
              }
            }
          })
        }
      })

      console.log("Processed Stunting Levels:", stuntingLevels)
      return stuntingLevels
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const NutritionScore = ({ score, label }) => (
    <View style={styles.nutritionItem}>
      <View style={styles.scoreContainer}>
        <Svg height="70" width="70">
          {/* Background Circle */}
          <Circle cx="35" cy="35" r="30" stroke="#E5E9F2" strokeWidth="6" fill="none" />
          {/* Dynamic Score Circle */}
          <Circle
            cx="35"
            cy="35"
            r="30"
            stroke={getScoreColor(score)}
            strokeWidth="6"
            strokeDasharray={`${score * 18.85},188.5`}
            fill="none"
            rotation="-90"
            origin="35,35"
          />
        </Svg>
        <Text style={styles.scoreText}>{score}</Text>
      </View>
      <Text style={styles.nutritionLabel}>{label}</Text>
    </View>
  )

  const getScoreColor = (score) => {
    if (score >= 7) return "#4CAF50"
    if (score >= 4) return "#FF9800"
    return "#F44336"
  }

  const nutritionData = [
    { score: 3, label: "Proteins" },
    { score: 7, label: "Carbs" },
    { score: 5, label: "Calories" },
  ]

  useEffect(() => {
    getAccount()
  }, [])

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image source={require("./image/Icon.png")} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.name}>{data.name || "User"}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logIntakeButton} onPress={() => navigation.navigate("Example")}>
            <Text style={styles.logIntakeText}>+ Log Intake</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dashboard Cards */}
      <View style={styles.dashboardSection}>
        {/* Nutrition Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nutrition Overview</Text>
          <View style={styles.nutritionRow}>
            {nutritionData.map((item, index) => (
              <NutritionScore key={index} score={item.score} label={item.label} />
            ))}
          </View>
        </View>

        {/* Menu Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Access</Text>
          <View style={styles.menuRow}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("DataImunization")}>
              <View style={styles.menuIconContainer}>
                <Image source={require("./image/imunisasion.png")} style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Immunization</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("DataControl")}>
              <View style={styles.menuIconContainer}>
                <Image source={require("./image/kontrol.png")} style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Control</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("StuntingRisk")}>
              <View style={styles.menuIconContainer}>
                <Image source={require("./image/tumbuh.png")} style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Growth</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Services Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Services</Text>
          <View style={styles.healthServices}>
            <View style={styles.healthTextContainer}>
              <Text style={styles.healthText}>Add health check data to monitor growth progress</Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.primaryButton} onPress={showConfirmDialog}>
                <Text style={styles.primaryButtonText}>Add Data</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Chatbot")}>
                <Icon name="chat" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Risk Level Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stunting Risk Levels</Text>
          <PieChart
            data={[
              {
                name: "Moderate",
                population: 48.0,
                color: "#FF9800",
                legendFontColor: "#333333",
                legendFontSize: 12,
              },
              {
                name: "High",
                population: 39.2,
                color: "#F44336",
                legendFontColor: "#333333",
                legendFontSize: 12,
              },
              {
                name: "Low",
                population: 34.2,
                color: "#4CAF50",
                legendFontColor: "#333333",
                legendFontSize: 12,
              },
            ]}
            width={Dimensions.get("window").width - 64}
            height={180}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            backgroundColor="transparent"
            accessor="population"
            paddingLeft="15"
            absolute
            style={styles.pieChart}
          />
        </View>

        {/* Article Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Featured Article</Text>
          <View style={styles.article}>
            <Image source={require("./image/stuntingg.png")} style={styles.articleImage} />
            <View style={styles.articleContent}>
              <Text style={styles.articleTitle}>Understanding Stunting</Text>
              <Text style={styles.articleExcerpt}>
                Stunting is a chronic condition resulting from nutritional deficiencies...
              </Text>
              <TouchableOpacity>
                <Text style={styles.readMoreLink}>Read More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaa8cb",
  },
  headerContainer: {
    backgroundColor: "#F2F2F2",
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "#000000",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  logIntakeButton: {
    backgroundColor: "#eaa8cb",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logIntakeText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 14,
  },
  dashboardSection: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  nutritionItem: {
    alignItems: "center",
  },
  scoreContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  scoreText: {
    position: "absolute",
    fontSize: 18,
    fontWeight: "bold",
  },
  nutritionLabel: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  menuItem: {
    alignItems: "center",
    width: "30%",
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#f5e0eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  menuIcon: {
    width: 40,
    height: 40,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
  },
  healthServices: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  healthTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  healthText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: "#d896b8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: "#607D8B",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  pieChart: {
    borderRadius: 16,
    marginVertical: 8,
    alignSelf: "center",
  },
  article: {
    flexDirection: "row",
    alignItems: "center",
  },
  articleImage: {
    height: 90,
    width: 120,
    borderRadius: 8,
  },
  articleContent: {
    flex: 1,
    paddingLeft: 16,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  articleExcerpt: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
    lineHeight: 20,
  },
  readMoreLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d896b8",
  },
})

export default HomePage
