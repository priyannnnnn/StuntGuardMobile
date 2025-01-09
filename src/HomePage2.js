import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

function homePage2({navigation}){
    return(
        <View style={styles.container}>
            <Image
            source={require('./image/baby_and_mommy.png')} // Replace with your image URL or local asset
            style={styles.image}
            />
            <Text style={styles.title}>
            Prevent Stunting {'\n'}with StuntGuard
            </Text>
            <Text style={styles.subtitle}>
            Early detection and appropriate intervention for a bright future
            </Text>
            <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    )
}
export default homePage2;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 20,
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: 20,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      color: '#000000',
    },
    subtitle: {
      fontSize: 14,
      textAlign: 'center',
      color: '#666666',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#FFC0CB',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
});
