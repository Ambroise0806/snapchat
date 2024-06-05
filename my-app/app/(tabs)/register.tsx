import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');

    async function handleSignUp () {
        const donnees = {"email":email,"password":password,"username":userName};
        try {
            const response = await fetch("https://snapchat.epidoc.eu/user", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
                body: JSON.stringify(donnees),
            });  
            return response.json();
        } catch (error) {
            console.log("Erreur lors de l'inscription", error)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                    value={email}
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={setEmail}
            />
            <TextInput
                    value={password}
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={setPassword}
            />
            <TextInput
                    value={userName}
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={setUserName}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    },
    title: {
    fontSize: 24,
    marginBottom: 20,
    },
    input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    },
});

export default SignUpScreen;
