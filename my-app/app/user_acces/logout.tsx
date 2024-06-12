import { View, Text, TextInput, StyleSheet, Button, Platform, Image, TouchableOpacity} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { API_KEY } from '@env';


const HomeScreen = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [userName, setUserName] = useState('');
        const [imageBase64, setimageBase64] = useState<string | null | undefined>(null);
        const [imageUri, setImageUri] = useState<string | null>(null);
        const [profilePicture, setProfilePicture] = useState()
        
        async function CrudModif() {
                const token = await AsyncStorage.getItem('token');
                if (token != null) {
            const donnees = { "email": email, "password": password, "username": userName, "profilePicture": profilePicture };
            try {
                const response = await fetch("https://snapchat.epidoc.eu/user", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": API_KEY,
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(donnees),
                });
                return response.json();
            } catch (error) {
                console.log("Erreur lors de la modification du profil", error)
            }
        }}

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Désolé, nous avons besoin des autorisations de la gallerie pour que cela fonctionne!');
                }  
                const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
                if (cameraStatus.status !== 'granted') {
                    alert('Désolé, nous avons besoin des autorisations de la caméra pour que cela fonctionne!');
                }      
        }
            })();
    }, []);

        const selectImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                base64: true,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
    
            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
                setimageBase64(result.assets[0].base64)
            }
        };

        const takePhoto = async () => {
            let result = await ImagePicker.launchCameraAsync({
                base64: true,
                allowsEditing: true,
                quality: 1,
            });
    
            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
                setimageBase64(result.assets[0].base64)
            }
        };
    
    const router = useRouter();
    const deleteToken = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/');
    };

    return (
        <View style={styles.container}>
                {!imageUri && <View>
                    <Button title="Sélectionner une image dans la Gallerie" color="#E82754" onPress={selectImage} />
                    <Button title="Prendre une photo" color="#3CB2E2" onPress={takePhoto} />
            </View>}
                {!imageUri && <View style={styles.containerImage}>
                </View>}
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
            <ThemedView style={styles.body}>
                <ThemedView style={styles.inscriptionContainer}>
                    <Button
                        onPress={deleteToken}
                        title="se déconnecter"
                        color="#E82754"
                        accessibilityLabel="Clicker pour se déconnecter"
                    />
                </ThemedView>
            </ThemedView>
            <View style={styles.button1}>
                <Button
                    title="Valider les modification du profil"
                    onPress={ CrudModif }
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    //real color snap 
    // jaune => #F4F01B
    // bleu => #3CB2E2
    // rouge => #E82754
    body: {
        justifyContent: 'center',
        width: '100%',
        height: '5%',
        backgroundColor:'white',
    },
    inscriptionContainer: {
        bottom: -300,
        gap: 8,
        marginBottom: -10,
    },
    connexionContainer: {
        bottom: 5,
        gap: 8,
        marginBottom: 8,
        backgroundColor: '#3CB2E2',
    },
    button1: {
        marginTop: 150,
    },
    containerImage: {

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'white',
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

export default HomeScreen;