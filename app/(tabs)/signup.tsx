import React from 'react';
import { StyleSheet, ScrollView, TextInput, Pressable, useColorScheme } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router'; // Import router for navigation

export default function SignInScreen() {
  const [username, onUsernameChange] = React.useState('');
  const [password, onPasswordChange] = React.useState('');

  const [signUpResponse, setSignUpResponse] = React.useState('');

  const createProfileApiReq = async () => {
    if (password.length < 4) {
      setSignUpResponse('Password is too short');
      return;
    }
    if (username.length < 4) {
      setSignUpResponse('Username is too short');
      return;
    }

    try {
      await fetch('https://snipeapi.azurewebsites.net/api/UserRegistration', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: username,
          pass: password,
        }),
      })
        .then((response) => {
          response.text().then((data) => {
            setSignUpResponse(data);
            console.log(username,password, data);

            if(data == "result: true"){
              router.replace('/')
            }
          });
        });
    } catch (error) {
      setSignUpResponse('There was an error');
    }
  };

  const theme = useColorScheme(); // Detect system theme
  const styles = createStyles(theme); // Create styles based on the theme

  return (
    <ScrollView style={styles.bg}>
      <View>
        <Text style={styles.pageTitle}>Snipe</Text>
      </View>
      <View style={styles.signInContainer}>
        <Text style={[styles.boldText, styles.centerText]}>Create An Account</Text>
        <Text style={styles.centerText}>Create your username and password</Text>

        <Text>{signUpResponse}</Text>

        <TextInput
          style={[styles.input, styles.marginTop]}
          value={username}
          onChangeText={onUsernameChange}
          placeholder="username"
          placeholderTextColor={theme === 'dark' ? '#888' : '#555'}
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={onPasswordChange}
          placeholder="password"
          placeholderTextColor={theme === 'dark' ? '#888' : '#555'}
          secureTextEntry
        />

        <Pressable onPress={createProfileApiReq} style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>

        <Text style={[styles.centerText, styles.spacer, styles.grayText]}>
          Already have an account?
        </Text>

        {/* Navigate to Sign In (index.tsx) on button press */}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace('/')} // Navigate to the index.tsx page
        >
          <Text style={styles.secondaryButtonText}>Take me to sign in page</Text>
        </Pressable>

        <View style={styles.spacer}>
          <Text style={styles.grayText}>By continuing to use this app, you accept the</Text>
          <Text>Terms of Service</Text>
          <Text style={styles.grayText}>and the</Text>
          <Text>Privacy Policy</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Dynamic styles based on the theme
const createStyles = (theme: string | null | undefined) => {
  const isDark = theme === 'dark';

  return StyleSheet.create({
    bg: {
      backgroundColor: isDark ? '#121212' : 'white',
    },
    pageTitle: {
      textAlign: 'center',
      marginTop: 60,
      marginBottom: 60,
      fontSize: 30,
      fontWeight: 'bold',
      color: isDark ? 'white' : 'black',
    },
    signInContainer: {
      textAlign: 'center',
      margin: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    boldText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? 'white' : 'black',
    },
    marginTop: {
      marginTop: 40,
    },
    centerText: {
      textAlign: 'center',
      color: isDark ? 'white' : 'black',
    },
    input: {
      height: 40,
      width: '100%',
      margin: 12,
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderColor: isDark ? '#888' : '#ccc',
      backgroundColor: isDark ? '#333' : '#f9f9f9',
      color: isDark ? 'white' : 'black',
    },
    button: {
      height: 40,
      width: '100%',
      backgroundColor: isDark ? '#333' : 'black',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
      paddingHorizontal: 32,
      borderRadius: 8,
      elevation: 3,
    },
    buttonText: {
      color: 'white',
    },
    secondaryButton: {
      height: 40,
      width: '100%',
      backgroundColor: isDark ? '#555' : '#eee',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
      paddingHorizontal: 32,
      borderRadius: 8,
      elevation: 3,
    },
    secondaryButtonText: {
      color: isDark ? 'white' : 'black',
    },
    spacer: {
      marginTop: 40,
      marginBottom: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    grayText: {
      color: isDark ? '#aaa' : 'gray',
    },
  });
};
