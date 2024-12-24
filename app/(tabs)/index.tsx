import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router'; // Make sure to import router
import AsyncStorage from '@react-native-async-storage/async-storage';//local storage to save login



const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInResponse, setSignInResponse] = useState('');

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

        //Store data and redirect
        let justToken = data.substring(3, data.length-1);

        let signInData = {
          "username": email,
          "password": password,
          "token": justToken,
          "lastSignIn": new Date().toUTCString(),
        }
        storeData("signInData", JSON.stringify(signInData));
        //redirectToCamera();
      } else {
        setSignInResponse('Error: Username or password incorrect');
      }
    } catch (error) {
      setSignInResponse('There was an error');
    }
  };

  const handleSignUpRedirect = () => {
    // This will navigate to the signup page
    router.push('./signup'); // The path here should match your route setup for the signup page
  };


  
  //store data in localstorage
  const storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('Data saved --> ' + key);
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };
  //get data from localstorage
  const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        //console.log('Retrieved data:', value);
        return value;
      }
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
  };
  

  //things in useEffect only run once regardless of rerenders 
  useEffect(() => {
    getData("signInData").then((value)=>{
      if(value != undefined){
        console.log(value);
        router.push('./camera');
      }
    })
  }, []);

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
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 350,
    height: 350,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
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

export default LoginScreen;
