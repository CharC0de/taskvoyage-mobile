import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import axios from 'axios';
import type { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';

type RootDrawerParamList = {
  Dashboard: undefined;
  AddTask: undefined;
  Calendar: undefined;
  Settings: undefined;
};

type SettingsScreenProps = DrawerScreenProps<RootDrawerParamList, 'Settings'>;

function SettingsScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isChangeUsernameVisible, setChangeUsernameVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const navigation: DrawerNavigationProp<ParamListBase> = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await axios.get(`${process.env.BACKENDIP}/user/${userId}`);
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const changeUsername = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.put(`http://your-api-url/user/${userId}`, { username: newUsername });
      setUsername(response.data.username);
      setChangeUsernameVisible(false);
    } catch (error) {
      console.error('Error changing username:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="bars" size={30} color="#000" onPress={() => navigation.toggleDrawer()} />
      <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profilePicture} />
      <Text style={styles.label}>Username: {username}</Text>
      <Text style={styles.label}>Email: {email}</Text>
      <Button title="Change Username" onPress={() => setChangeUsernameVisible(true)} />
      <Button title="FAQ" onPress={() => setModalVisible(true)} />

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>FAQ</Text>
          <Text>Q: How to change my password?</Text>
          <Text>A: Click on 'Change Password' and follow the instructions.</Text>
          <Text>Q: How to change my username?</Text>
          <Text>A: Click on 'Change Username' and follow the instructions.</Text>
          <Text>Q: How do I add a task and event?</Text>
          <Text>A: Step 1 = Input Title Name: Enter the name of your task / event.</Text>
          <Text> Step 2 = Input Dates: Specify the starting and ending dates for your task.</Text>
          <Text> Step 3 = Input Times: Enter the starting and ending times for your event on the chosen dates.</Text>
          <Text> Step 4 = Write and choose the description: Provide a description or category for your event.</Text>
          <Text> Step 5 = Click Submit: Your event is now created and will be displayed on your homepage and calendar.</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <Modal isVisible={isChangeUsernameVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change Username</Text>
          <TextInput
            style={styles.input}
            placeholder="New Username"
            value={newUsername}
            onChangeText={setNewUsername}
          />
          <Button title="Submit" onPress={changeUsername} />
          <Button title="Cancel" onPress={() => setChangeUsernameVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

function Dashboard() {
  return (
    <View style={styles.screenContainer}>
      <Text>Homepage</Text>
    </View>
  );
}

function AddTask() {
  return (
    <View style={styles.screenContainer}>
      <Text>Tasks</Text>
    </View>
  );
}

function Calendar() {
  return (
    <View style={styles.screenContainer}>
      <Text>Calendar</Text>
    </View>
  );
}

function Settings() {
  return (
    <View style={styles.screenContainer}>
      <Text>Settings</Text>
    </View>
  );
}

type CustomDrawerContentProps = {
  navigation: any;
};

function CustomDrawerContent({ navigation }: CustomDrawerContentProps) {
  const handleLogout = () => {
    Alert.alert('Confirm', 'Are you sure you want to logout your account?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => navigation.replace('Login'),
      },
    ]);
  };

  return (
    <View style={styles.drawerContent}>
      <Button title="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Tasks" onPress={() => navigation.navigate('AddTask')} />
      <Button title="Calendar" onPress={() => navigation.navigate('Calendar')} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="AddTask" component={AddTask} />
        <Drawer.Screen name="Calendar" component={Calendar} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#874c3c',
    alignItems: 'center',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
});
