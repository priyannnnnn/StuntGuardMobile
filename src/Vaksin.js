import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const ImmunizationForm = () => {
  const [formData, setFormData] = useState({
    nik: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    birthWeight: '',
  });

  const handleSave = async() => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to save data.');
      return;
    }
    try {
      const sequenceRef = database().ref(`/sequence`);
      const sequenceSnapshot = await sequenceRef.once('value');
      let currentSequence = sequenceSnapshot.val() || 0;

      // Increment the sequence
      currentSequence += 1;

      // Save the updated sequence back to the database
      await sequenceRef.set(currentSequence);

      await database()
        .ref(`/users/${currentUser.uid}/Immunization/${currentSequence}`)
        .set({...formData});
      // navigation.navigate('HomePage')
      Alert.alert('Succes, Save Data');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save data.');
    }

    // const { stuntingLevel, stuntingPercentage } = calculateStuntingLevel(data);

    console.log('Form data:', formData);
    // Implement save functionality here
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          {/* <Icon name="arrow-left" size={24} color="#000" /> */}
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            {/* <Icon name="bell" size={24} color="#000" /> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            {/* <Icon name="users" size={24} color="#000" /> */}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>DATA IMUNIZATION</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NIK</Text>
            <TextInput
              style={styles.input}
              value={formData.nik}
              onChangeText={(text) => setFormData({ ...formData, nik: text })}
              placeholder="Enter NIK"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholder="Enter full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>DATE OF BIRTH</Text>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              placeholder="DD/MM/YYYY"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>GENDER</Text>
            <TextInput
              style={styles.input}
              value={formData.gender}
              onChangeText={(text) => setFormData({ ...formData, gender: text })}
              placeholder="Select gender"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>BIRTH WEIGHT</Text>
            <TextInput
              style={styles.input}
              value={formData.birthWeight}
              onChangeText={(text) => setFormData({ ...formData, birthWeight: text })}
              placeholder="Enter birth weight"
            />
          </View>

          <View style={styles.statusSection}>
            <Text style={styles.label}>IMUNIZATION STATUS</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>COMPLETE</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Icon name="target" size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="shopping-bag" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="heart" size={24} color="#000" />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8D7E8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

export default ImmunizationForm;
