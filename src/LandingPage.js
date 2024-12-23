import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function LandingPage({navigation}){
    return(
    <View style={styles.container}>
      <Text style={styles.title}>Bagaimana Keadaan Anda Saat Ini?</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('PregnantWomanData')}>
          <Image
            source={require('./image/kehamilan.png')} // Replace with your local image path
            style={styles.icon}
          />
          <Text style={styles.optionText}>Mengalami Kehamilan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('BabyForm')}>
          <Image
            source={require('./image/baby.png')} // Replace with your local image path
            style={styles.icon}
          />
          <Text style={styles.optionText}>Memiliki Balita</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Main')}>
        <Text style={styles.nextButtonText}>Lanjut</Text>
      </TouchableOpacity>
    </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color:'black',
      textAlign: 'center',
    },
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: 20,
    },
    optionButton: {
      alignItems: 'center',
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      width: 120,
    },
    icon: {
      width: 70,
      height: 70,
      marginBottom: 10,
    },
    optionText: {
      fontSize: 14,
      textAlign: 'center',
    },
    nextButton: {
      marginTop: 30,
      backgroundColor: '#FFC0CB',
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 20,
    },
    nextButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
    },
  });