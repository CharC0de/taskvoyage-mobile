import { PaperProvider } from 'react-native-paper';
import Router from './router/Router';
import { NavigationContainer } from '@react-navigation/native'

export default function App() {
  return (

    <PaperProvider>
      <Router />
    </PaperProvider>

  );
}