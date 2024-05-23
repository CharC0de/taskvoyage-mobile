import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../Pages/Login'
import EmailConfirmation from '../Pages/EmailConfirmation'
import Register from '../Pages/Register'
import AddTask from '../Pages/AddTask'
import Dashboard from '../Pages/Dasboard'
import Settings from '../Pages/Settings'
import Calendar from '../Pages/Calendar'



const Stack = createNativeStackNavigator()
export default function Router() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
      <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
      <Stack.Screen name='EmailConfirmation' component={EmailConfirmation} options={{ headerShown: false }} />
      <Stack.Screen name='Dashboard' component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name='AddTask' component={AddTask} options={{ headerShown: false }} />
      <Stack.Screen name='Calendar' component={Calendar} options={{ headerShown: false }} />
      <Stack.Screen name='Settings' component={Settings} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}
