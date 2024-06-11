import React, { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '@env';
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
} from 'react-native';

type ItemData = {
    _id: string;
    username: string;
};

type ItemProps = {
    item: ItemData;
    onPress: () => void;
    backgroundColor: string;
    textColor: string;
};

const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>{item.username}</Text>
    </TouchableOpacity>
);

const App: React.FC = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setimageBase64] = useState<string | null | undefined>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [data, setData] = useState<ItemData[]>([]);
    const [error, setError] = useState<string | null>(null);

    const getUsers = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token != null) {
            try {
                const response = await fetch('https://snapchat.epidoc.eu/user', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": API_KEY,
                        Authorization: `Bearer ${token}`,
                    },
                });
                const json = await response.json();
                setData(json.data);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch users");
            }
        } else {
            setError("No token found");
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const renderItem = ({ item }: { item: ItemData }) => {
        const backgroundColor = item._id === selectedId ? '#E82754' : '#3CB2E2';
        const color = item._id === selectedId ? 'white' : 'black';
        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item._id)}
                backgroundColor={backgroundColor}
                textColor={color}
            />
        );
    };

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

    const deleteImage = async () => {
        setImageUri(null);
    };

    return (
        <View style={styles.container}>
            {!imageUri && <View>
                <Button title="Gallerie" color="#E82754" onPress={selectImage} />
                <Button title="Prendre une photo" color="#3CB2E2" onPress={takePhoto} />
            </View>}
            {imageUri && <View style={{ marginTop: 20 }}>
                <Button title="Supprimer la photo" color="#E82754" onPress={deleteImage} />
            </View>}
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            {imageUri && <SafeAreaView style={styles.containerList}>
                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        extraData={selectedId}
                    />
                )}
            </SafeAreaView>}
        </View>
    );

};

const styles = StyleSheet.create({
    containerList: {
        flex: 1,
        marginTop: 10,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        backgroundColor: '#F4F01B'
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
    },
});

export default App;