import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, TextInput, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation, ParamListBase, NavigationProp } from '@react-navigation/native';



export default function Register() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const [pVisibility, setPVisibility] = useState(true);
  const [eyeIcon, setIcon] = useState('eye-off');
  const showPass = () => {
    setPVisibility(!pVisibility);
    setIcon(pVisibility ? 'eye' : 'eye-off');
  };

  const toLogin = () => {
    navigation.navigate('Login');
  };

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    console.log(process.env.EXPO_PUBLIC_BACKENDIP)
    try {
      const response = await axios.post(
        process.env.EXPO_PUBLIC_BACKENDIP + "/api/register/",
        {
          first_name,
          last_name,
          username,
          email,
          password,
          confirm_password,
        }
      );
      console.log(process.env.EXPO_PUBLIC_BACKENDIP)
      if (response && response.data) {
        setFirst_name("");
        setLast_name("");
        setUsername("");
        setEmail("");
        setPassword("");
        setError("");
        setConfirmPassword("");
        console.log(response)
        navigation.navigate('EmailConfirmation', { uid: response.data.uid, token: response.data.token });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      console.error(error)
      setError(error.response?.data?.message || error.message);
    }

  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#BCA89F', paddingBottom: 50 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
        <Icon style={{ flex: 1, marginHorizontal: 20 }} name='arrow-left' size={20} onPress={toLogin} />
        <Text style={{ fontSize: 30 }}>TaskVoyage</Text>
        <View style={{ flex: 1, marginHorizontal: 20 }} />
      </View>
      <View style={{ width: '80%' }}>
        <Card style={{ backgroundColor: '#B27846' }}>
          <Card.Content>
            <View style={{ margin: 10 }}>
              <Text style={{ color: '#F5F5F5', fontSize: 16 }}>Please Fill out these Informations.</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1, marginHorizontal: 2.5 }}>
                <TextInput
                  selectionColor="black"
                  underlineColor="transparent"
                  activeUnderlineColor="#B27846"
                  style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderRadius: 10, height: 50 }}
                  label="First Name"
                  value={first_name}
                  onChangeText={setFirst_name}
                />
              </View>
              <View style={{ marginTop: 10, flex: 1, marginHorizontal: 2.5 }}>
                <TextInput
                  selectionColor="black"
                  underlineColor="transparent"
                  activeUnderlineColor="#B27846"
                  style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderRadius: 10, height: 50 }}
                  label="Last Name"
                  value={last_name}
                  onChangeText={setLast_name}
                />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <TextInput
                selectionColor="black"
                underlineColor="transparent"
                activeUnderlineColor="#B27846"
                style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderRadius: 10, height: 50 }}
                label="Username"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <TextInput
                selectionColor="black"
                underlineColor="transparent"
                activeUnderlineColor="#B27846"
                style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderRadius: 10, height: 50 }}
                label="Email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <TextInput
                selectionColor="black"
                underlineColor="transparent"
                activeUnderlineColor="#B27846"
                secureTextEntry={pVisibility}
                right={<TextInput.Icon icon={eyeIcon} onPress={showPass} />}
                style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderRadius: 10, height: 50 }}
                label="Password"
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <TextInput
                selectionColor="black"
                underlineColor="transparent"
                activeUnderlineColor="#B27846"
                secureTextEntry={pVisibility}
                style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderRadius: 10, height: 50 }}
                label="Confirm Password"
                value={confirm_password}
                onChangeText={setConfirmPassword}
              />
            </View>
            {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                marginHorizontal: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: 100,
                  backgroundColor: '#F5F5F5',
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={toLogin}
              >
                <Text style={{ fontWeight: 'bold' }}>To Login</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                marginHorizontal: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: 100,
                  backgroundColor: '#F5F5F5',
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={handleSubmit}
              >
                <Text style={{ fontWeight: 'bold' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

