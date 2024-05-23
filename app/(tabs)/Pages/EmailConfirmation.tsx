import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';

type ParamList = {
  Creds: {
    uid: any;
    token: any
  };
};
export default function EmailConfirmation() {
  const route = useRoute<RouteProp<ParamList, 'Creds'>>();;
  const { uid, token } = route.params || {}; // Handle case when params is undefined
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!uid || !token) return; // Exit early if uid or token is not present

    const confirmEmail = async () => {
      try {
        await axios.get(`${process.env.BACKENDIP}/api/confirm-email/${uid}/${token}/`);
        setConfirmationMessage('Email confirmation successful! You can now log in.');
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Email confirmation failed. Please try again.');
        setConfirmationMessage('');
      }
    };

    confirmEmail();
  }, [uid, token]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#BCA89F' }}>
      <View>
        <Text>Email Confirmation</Text>
        {confirmationMessage && <Text>{confirmationMessage}</Text>}
        {errorMessage && <Text>{errorMessage}</Text>}
      </View>
    </SafeAreaView>
  );
}
