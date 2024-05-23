import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Card, TextInput, Button } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, ParamListBase, NavigationProp } from '@react-navigation/native';


// Type annotation for navigation object

export default function Login() {
    const [formData, setFormData] = useState({
        user: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigation: NavigationProp<ParamListBase> = useNavigation();

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const [pVisibility, setPVisibility] = useState(true);
    const [eyeIcon, setIcon] = useState('eye-off');
    const showPass = () => {
        setPVisibility(!pVisibility);
        setIcon(pVisibility ? 'eye' : 'eye-off');
    };


    const handleSubmit = async () => {
        try {
            const response = await axios.post(process.env.BACKENDIP + '/api/login/', formData);

            if (response.status === 200) {
                const { userId, message } = response.data;

                // Store the userId in AsyncStorage
                await AsyncStorage.setItem('userId', userId.toString());

                console.log('User logged in successfully');
                navigation.navigate('Dashboard');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to login. Please try again.');
        }
    };

    const toRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#BCA89F' }}>
            <View>
                <Avatar.Image size={300} source={require('../assets/ship.png')} style={{ backgroundColor: 'rgba(0,0,0,0)' }} />
            </View>
            <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 30 }}>TaskVoyage</Text>
            </View>
            <View style={{ width: '80%' }}>
                <Card style={{ backgroundColor: '#B27846' }}>
                    <Card.Content>
                        <TextInput
                            style={{ backgroundColor: '#F5F5F5' }}
                            label="E-mail"
                            value={formData.user}
                            onChangeText={(text: string) => handleChange('user', text)}
                            activeUnderlineColor='#F5F5F5'
                            keyboardType='email-address'
                        />
                        <TextInput
                            style={{ marginTop: 10, backgroundColor: '#F5F5F5' }}
                            label="Password"
                            value={formData.password}
                            onChangeText={(text: string) => handleChange('password', text)}
                            activeUnderlineColor='#F5F5F5'
                            secureTextEntry={pVisibility}
                            right={<TextInput.Icon icon={eyeIcon as any} onPress={showPass} />}
                        />
                        <Button textColor='#f5f5f5' style={{ alignSelf: 'flex-end' }}>Forgot Password?</Button>
                        <TouchableOpacity
                            style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', padding: 10, borderRadius: 10 }}
                            onPress={handleSubmit}
                        >
                            <Text style={{ fontWeight: 'bold' }}>Log-in</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>Don't have an account?</Text>
                            <TouchableOpacity>
                                <Text style={{ color: '#f5f5f5', margin: 10, fontWeight: 'bold' }} onPress={toRegister}>Sign-up</Text>
                            </TouchableOpacity>
                        </View>
                    </Card.Content>
                </Card>
            </View>
            {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}
        </SafeAreaView>
    );
}
