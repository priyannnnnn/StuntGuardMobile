import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-react-native'; // Required for TensorFlow in React Native
import RNFS from 'react-native-fs'; // File system library
import jpeg from 'jpeg-js'; // JPEG decoding library

export default function Profile() {
  const [photoUri, setPhotoUri] = useState(null);
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    // Initialize TensorFlow
    const initializeTF = async () => {
      try {
        await tf.ready();
        console.log('TensorFlow is ready!');
      } catch (err) {
        console.error('Error initializing TensorFlow:', err);
      }
    };
    initializeTF();
  }, []);

  const uploadImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.error('ImagePicker Error:', response.errorMessage);
        } else {
          const uri = response.assets[0].uri;
          setPhotoUri(uri);
        }
      }
    );
  };

  const recognizeFood = async () => {
    if (!photoUri) {
      Alert.alert('Error', 'Please upload a photo first');
      return;
    }

    try {
      // Load the MobileNet model
      const model = await mobilenet.load();

      // Read the image file and decode it
      const imageData = await RNFS.readFile(photoUri, 'base64');
      const rawImageData = jpeg.decode(Buffer.from(imageData, 'base64'), { useTArray: true });

      // Convert the decoded image to a tensor
      const imageTensor = tf.browser.fromPixels({
        data: new Uint8Array(rawImageData.data),
        width: rawImageData.width,
        height: rawImageData.height,
      });

      // Make predictions
      const predictions = await model.classify(imageTensor);
      setPrediction(predictions[0]?.className || 'Unknown');
    } catch (err) {
      Alert.alert('Error', 'Failed to recognize food');
      console.error('Recognition Error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Image" onPress={uploadImage} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}
      <Button title="Recognize Food" onPress={recognizeFood} />
      {prediction && <Text style={styles.result}>Detected: {prediction}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
    color: '#333',
  },
});
