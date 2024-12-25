import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Local storage to save login
import { useColorScheme } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInResponse, setSignInResponse] = useState('');
  const colorScheme = useColorScheme(); // Detect light or dark mode

  const isDarkMode = colorScheme === 'dark';

  const handleLogin = async () => {
    if (password.length < 4 || email.length < 4) {
      return;
    }
    console.log(password, email);

    try {
      const response = await fetch('https://snipeapi.azurewebsites.net/api/UserSignIn', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: email,
          pass: password,
        }),
      });
      const data = await response.text();

      if (data.length > 0 && data.charAt(0) === '(') {
        setSignInResponse('Good: ' + data);

        // Store data and redirect
        let commaIndex = data.indexOf(',');
        let justToken = data.substring(commaIndex + 1, data.length - 1);
        let userId = data.substring(1, commaIndex);
        console.log(userId + ' | ' + justToken + ' | ' + commaIndex);

        let signInData = {
          username: email,
          password: password,
          user_id: userId,
          token: justToken,
          lastSignIn: new Date().toUTCString(),
        };
        storeData('signInData', JSON.stringify(signInData));
        router.push('./camera');
      } else {
        setSignInResponse('Error: Username or password incorrect');
      }
    } catch (error) {
      setSignInResponse('There was an error');
    }
  };

  const handleSignUpRedirect = () => {
    router.push('./signup');
  };

  const storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('Data saved --> ' + key);
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };

  const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
  };

  useEffect(() => {
    getData('signInData').then((value) => {
      if (value !== undefined) {
        console.log(value);
        router.push('./camera');
      }
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: isDarkMode ? '#121212' : '#fff',
    },
    title: {
      fontSize: 30,
      textAlign: 'center',
      marginBottom: 5,
      color: isDarkMode ? '#fff' : '#000',
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      color: isDarkMode ? '#bbb' : '#666',
      marginBottom: 20,
    },
    input: {
      height: 50,
      borderColor: isDarkMode ? '#444' : '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 10,
      backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    },
    button: {
      backgroundColor: '#007bff',
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    signupLink: {
      marginTop: 15,
      alignItems: 'center',
    },
    signupText: {
      color: '#007bff',
    },
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Type in your credentials to log in</Text>
        <Text style={styles.subtitle}>[Kev Test]: {signInResponse}</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupLink} onPress={handleSignUpRedirect}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
