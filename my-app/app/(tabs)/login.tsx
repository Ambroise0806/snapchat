import { Image, StyleSheet, TextInput, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react'

  const SignIn= () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(donnees: any) {
      try {
        const reponse = await fetch("https://snapchat.epidoc.eu/user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donnees),
        });
        console.log(reponse)
        return reponse.json();
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
        color="yellow"
        onPress={() => (handleSubmit({"email":email,"password":password}))}
        />
        </ThemedView>
      </ThemedView>
    // {/* </ParallaxScrollView> */}
  );
}
  
  const styles = StyleSheet.create({
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