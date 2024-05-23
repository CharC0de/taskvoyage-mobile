import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, } from 'react-native'; // Import AsyncStorage
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { NavigationContainer, NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Calendar as RNCalendar } from 'react-native-calendars';
import axios from 'axios';
import DatePicker from 'react-native-datepicker';
import Modal from 'react-native-modal';
import Dashboard from './Dasboard';

type NewEvent = {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
};
type Event = {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
};

type CalendarProps = {
  navigation: any;
};

const Calendar: React.FC<CalendarProps> = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    description: '',
  });

  // Retrieve user ID from AsyncStorage
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('userId').then((id: React.SetStateAction<string | null>) => {
      setUserId(id);
    });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchEvents(selectedDate);
    }
  }, [selectedDate]);

  const fetchEvents = async (date: string) => {
    try {
      const response = await axios.get(`${process.env.BACKENDIP}/api/events/?date=${date}&userId=${userId}`);
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addEvent = async () => {
    try {
      const eventWithUserId = { ...newEvent, userId };
      await axios.post(process.env.BACKENDIP + '/api/events/', eventWithUserId);
      Alert.alert('Success', 'Event added successfully');
      setModalVisible(false);
      fetchEvents(selectedDate);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmAddEvent = () => {
    Alert.alert('Confirm', 'Are you sure you want to add this event?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Submit',
        onPress: addEvent,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Icon name="bars" size={30} color="#000" onPress={() => navigation.toggleDrawer()} />
      <Button title="Add Event" onPress={() => setModalVisible(true)} />
      <RNCalendar
        onDayPress={(day: { dateString: React.SetStateAction<string>; }) => {
          setSelectedDate(day.dateString);
          setSelectedEvent(null);
        }}
      />
      <View style={styles.eventDetails}>
        {selectedEvent ? (
          <>
            <Text>Title: {selectedEvent.title}</Text>
            <Text>Start Date: {selectedEvent.startDate}</Text>
            <Text>End Date: {selectedEvent.endDate}</Text>
            <Text>Start Time: {selectedEvent.startTime}</Text>
            <Text>End Time: {selectedEvent.endTime}</Text>
            <Text>Description: {selectedEvent.description}</Text>
          </>
        ) : (
          <Text>No Event on this date</Text>
        )}
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={newEvent.title}
            onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
          />
          <DatePicker
            style={styles.datePicker}
            date={newEvent.startDate}
            mode="date"
            placeholder="Start Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date: any) => setNewEvent({ ...newEvent, startDate: date })}
          />
          <DatePicker
            style={styles.datePicker}
            date={newEvent.endDate}
            mode="date"
            placeholder="End Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date: any) => setNewEvent({ ...newEvent, endDate: date })}
          />
          <TextInput
            style={styles.input}
            placeholder="Start Time"
            value={newEvent.startTime}
            onChangeText={(text) => setNewEvent({ ...newEvent, startTime: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="End Time"
            value={newEvent.endTime}
            onChangeText={(text) => setNewEvent({ ...newEvent, endTime: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newEvent.description}
            onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
          />
          <Button title="Submit" onPress={confirmAddEvent} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

// Placeholder components for other screens
const Homepage: React.FC = () => {
  return (
    <View style={styles.screenContainer}>
      <Text>Homepage</Text>
    </View>
  );
};

const AddTask: React.FC = () => {
  return (
    <View style={styles.screenContainer}>
      <Text>Tasks</Text>
    </View>
  );
};

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.screenContainer}>
      <Text>Settings</Text>
    </View>
  );
};

// Custom drawer content
const CustomDrawerContent: React.FC = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const handleLogout = () => {
    Alert.alert('Confirm', 'Are you sure you want to logout your account?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => navigation.navigate('Login'),
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
};

const Drawer = createDrawerNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props: any) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="AddTask" component={AddTask} />
        <Drawer.Screen name="Calendar" component={Calendar} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#874c3c',
  },
  eventDetails: {
    padding: 15,
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  datePicker: {
    width: '100%',
    marginBottom: 10,
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

export default App;
