import { Image, StyleSheet, TextInput, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  "(tabs)/index": { string: string } | undefined;
};

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fetchError, setFetchError] = useState('');

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const router = useRouter();

  async function handleSubmit() {

    const donnees = { "email": email, "password": password };

    try {
      const reponse = await fetch("https://snapchat.epidoc.eu/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify(donnees),
      });

      const data = await reponse.json();

      if (reponse.status === 400) {
        setFetchError('Erreur lors de la connexion !')
      } else {
        await AsyncStorage.setItem('token', data.data['token']);
        const token = await AsyncStorage.getItem('token');
        console.log('login'+token)
        router.replace('sendUsers');
      }
    } catch (erreur) {
      console.error("Erreur lors de la connexion :", erreur);
    }
  }

  return (
    <ThemedView style={styles.body}>
      <ThemedView style={styles.image}>
        <Image
          source={require('@/assets/images/snap.png')}
          style={styles.reactLogo}
        />
      </ThemedView>
      < ThemedView style={styles.main}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Se connecter à snapchat</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">adresse e-mail</ThemedText>
          <TextInput style={styles.button}
            onChangeText={setEmail}
            placeholderTextColor="black"
            autoCorrect={false}
          />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Mot de pase</ThemedText>
          <TextInput style={styles.button}
            onChangeText={setPassword}
            placeholderTextColor="black"
            secureTextEntry
            autoCorrect={false}
          />
        </ThemedView>
        <Button
          // holder="black"
          title="Connexion"
          onPress={handleSubmit}
        />
      </ThemedView>
      <ThemedView style={styles.homeButton}>
        <Button
          onPress={() => navigation.navigate('(tabs)/index')}
          title="Home"
          accessibilityLabel="Clicker pour s'inscrire"
        />
      </ThemedView>
      <ThemedView style={styles.fetchErrorContain}>
        {fetchError && <ThemedText style={styles.fetchError}>{fetchError}</ThemedText>}
      </ThemedView>
    </ThemedView>
    // {/* </ParallaxScrollView> */}
  );
}

const styles = StyleSheet.create({
  fetchErrorContain: {
    top: 150,
    width: '100%',
    color: '#ffffff',
    backgroundColor: '#E82754',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fetchError: {
    color: '#ffffff',
  },

  homeButton: {
    alignItems: "center",
    top: 430,
  },

  image: {
    alignItems: "center",
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 8,
    // backgroundColor: 'white',
    marginBottom: 8,

  },
  stepContainer: {
    // gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 60,
    width: 60,
    top: 70,
    // left: 135,
    justifyContent: 'center',
    position: 'absolute',
  },
  button: {
    backgroundColor: "#F2F2F2",
    height: 40,
  },
  body: {
    // margin: 10,
    flexDirection: 'column',
    alignItems: "center",
    backgroundColor: "white",
    // alignItems: '',
    gap: 8,
  },
  main: {
    top: 150,
  }
});

export default SignIn