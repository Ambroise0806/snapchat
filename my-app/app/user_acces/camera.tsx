import React, { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getData() {
    try {
        const token = await AsyncStorage.getItem('token');
        return token;
    } catch (e) {
        console.log('Error when checking the login token =>' + e)
    }
};

const App: React.FC = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);

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
    },
        []);

    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Gallerie" onPress={selectImage} />
            <Button title="Prendre une photo" onPress={takePhoto} />
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
    },
});

export default App;