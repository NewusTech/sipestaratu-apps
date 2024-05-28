import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useSession } from '../../components/ctx';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const LoginScreen = () => {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Handle the login logic
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    setLoading(true);

    const response = await fetch('https://sipestaratu.newus.site/api/auth', {
      body: formData,
      method: 'post',
    });
    if (response.status === 400) {
    } else {
      const res = await response.json();
      // {"identitas": {"avatar": "1598349078.png", "company": "ADMIN", "email": "admin@admin.com", "id": "1", "nama": "Admin istrator"}, "status": true, "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEifQ.QkNDxkFTmtlvoPBfJvDgoda-dK5BOikP_6LCs3irYmE"}
      signIn(res.token);
      signIn(res.token);
      await SecureStore.setItemAsync('id', res.identitas.id);
      await SecureStore.setItemAsync('nama', res.identitas.nama);
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={require('../../assets/images/Lambang_Kabupaten_Tanggamus.png')}
          style={{ width: 76, height: 103 }}
        />
      </View>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SIPESTARATU</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showPasswordButton}
        >
          <Text style={styles.showPasswordText}>
            {showPassword ? 'hide password' : 'show password'}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>SIGN IN</Text>
      </TouchableOpacity>
      <Text style={styles.termsText}>
        by Logging in, you agree to the
        <Text style={styles.linkText}> Privacy Policy & Terms of Service</Text>
      </Text>
      <TouchableOpacity onPress={() => { }}>
        <Text style={styles.signUpText}>not a member? Sign up now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    marginBottom: 60,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    top: 45,
  },
  showPasswordText: {
    color: 'green',
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  termsText: {
    marginTop: 20,
  },
  linkText: {
    color: 'blue',
  },
  signUpText: {
    color: 'green',
    marginTop: 20,
  },
});

export default LoginScreen;
//
// <svg width="100%" height="100%" viewBox="0 0 375 333" xmlns="http://www.w3.org/2000/svg">
//   <g transform="translate(375, 333) rotate(180)">
//     <path d="M0 0h375v250s-150 20-187.5 50S0 250 0 250V0z" fill="#00653E" />
//     <path d="M0 0h375v200s-120 40-187.5 70S0 200 0 200V0z" fill="#004C2C" />
//     <path d="M0 0h375v150s-90 60-187.5 90S0 150 0 150V0z" fill="#003D23" />
//   </g>
// </svg>
