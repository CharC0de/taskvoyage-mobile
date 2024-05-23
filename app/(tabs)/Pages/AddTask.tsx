import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import DatePicker from 'react-native-datepicker';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

type Task = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  category: string;
  status?: string;
};

type NewTask = Omit<Task, 'id' | 'status'>;

type AddTaskProps = {
  navigation: any;
};

const AddTask: React.FC<AddTaskProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    category: '',
  });
  const [userId, setUserId] = useState<string | null>(null); // Add userId state

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id !== null) {
        setUserId(id);
      }
    } catch (error) {
      console.error('Error fetching userId from AsyncStorage:', error);
    }
  };

  const searchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.BACKENDIP}/api/tasks/?search=${searchQuery}&userId=${userId}`); // Include userId in the search query
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async () => {
    try {
      await axios.post('http://your-django-backend-url/api/tasks/', { ...newTask, userId }); // Include userId in the task data
      Alert.alert('Success', 'Task added successfully');
      setModalVisible(false);
      searchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmAddTask = () => {
    Alert.alert('Confirm', 'Are you sure you want to add this task?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Submit',
        onPress: addTask,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Icon name="bars" size={30} color="#000" onPress={() => navigation.toggleDrawer()} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search tasks"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={searchTasks} />
      {tasks.length === 0 ? (
        <Text>No task exists. Create Task</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedTask(item)}>
              <View style={styles.taskRow}>
                <Text>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedTask && (
        <View style={styles.taskDetail}>
          <Text>Title: {selectedTask.title}</Text>
          <Text>Start Date: {selectedTask.startDate}</Text>
          <Text>End Date: {selectedTask.endDate}</Text>
          <Text>Start Time: {selectedTask.startTime}</Text>
          <Text>End Time: {selectedTask.endTime}</Text>
          <Text>Category: {selectedTask.category}</Text>
          <Text>Status: {selectedTask.status}</Text>
        </View>
      )}

      <Button title="Add Task" onPress={() => setModalVisible(true)} />

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newTask.title}
            onChangeText={(text) => setNewTask({ ...newTask, title: text })}
          />
          <DatePicker
            style={styles.datePicker}
            date={newTask.startDate}
            mode="date"
            placeholder="Start Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date: any) => setNewTask({ ...newTask, startDate: date })}
          />
          <DatePicker
            style={styles.datePicker}
            date={newTask.endDate}
            mode="date"
            placeholder="End Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date: any) => setNewTask({ ...newTask, endDate: date })}
          />
          <TextInput
            style={styles.input}
            placeholder="Start Time"
            value={newTask.startTime}
            onChangeText={(text) => setNewTask({ ...newTask, startTime: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="End Time"
            value={newTask.endTime}
            onChangeText={(text) => setNewTask({ ...newTask, endTime: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={newTask.category}
            onChangeText={(text) => setNewTask({ ...newTask, category: text })}
          />
          <Button title="Submit" onPress={confirmAddTask} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

// Placeholder components for other screens
const Dashboard: React.FC = () => {
  return (
    <View style={styles.screenContainer}>
      <Text>Homepage</Text>
    </View>
  );
};

const TasksScreen: React.FC = () => {
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
const Calendar: React.FC = () => {
  return (
    <View style={styles.screenContainer}>
      <Text>Calendar</Text>
    </View>
  );
};

// Custom drawer content
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
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
      <Button title="Tasks" onPress={() => navigation.navigate('Tasks')} />
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
        <Drawer.Screen name="Tasks" component={TasksScreen} />
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
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  taskRow: {
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  taskDetail: {
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
