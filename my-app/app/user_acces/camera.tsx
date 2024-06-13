import React, { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '@env';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    Alert,
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
    const [duration, setDuration] = useState<number | null>(null);
    
    const Dropdown = () => {
      const placeholder = {
        label: 'Selectionner votre temps',
        value: null,
      };  const options = [
        { label: '1 sec', value: 1 },
        { label: '2 sec', value: 2 },
        { label: '3 sec', value: 3 },
        { label: '4 sec', value: 4 },
        { label: '5 sec', value: 5 },
        { label: '6 sec', value: 6 },
        { label: '7 sec', value: 7 },
        { label: '8 sec', value: 8 },
        { label: '9 sec', value: 9 },
        { label: '10 sec', value: 10 },
      ];  
      return (
        <View>
          <RNPickerSelect
            placeholder={placeholder}
            items={options}
            onValueChange={(value) => setDuration(value)}
            value={duration}
          />
        </View>
      );
    };
    async function handleSubmit() {

      const donnees = { "to": selectedId, "image": `data:image/png;base64,${imageBase64}`, "duration": duration };
      console.log(donnees)
      const token = await AsyncStorage.getItem('token');
      if(token != null){
        try {
          const reponse = await fetch("https://snapchat.epidoc.eu/snap", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": API_KEY,
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(donnees),
          });
          const json = await reponse.json();
          if (reponse.status === 400){
            setError(json.data);
            Alert.alert("Echec de l'envoie", '')  
          }else{
            Alert.alert("Snap envoyé", '')  
          }
          console.log(json)
          
        } catch (erreur) {
          console.error("Erreur lors de l'envoie du snap :", erreur);
        }
      }else {
        setError("No token found");
      }
    }
  

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
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Désolé, nous avons besoin des autorisations de la gallerie pour que cela fonctionne!');
            }

            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus.status !== 'granted') {
                alert('Désolé, nous avons besoin des autorisations de la caméra pour que cela fonctionne!');
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

            {imageUri && 
            <View style={{ marginTop: 20 }}>
              <Button title="Supprimer la photo" color="#E82754" onPress={deleteImage} />
              <Image source={{ uri: imageUri }} style={styles.image} />
              <Dropdown/>
              <SafeAreaView style={styles.containerList}>
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
                <View style={styles.button1}>
                <Button
                    title="ENVOYER"
                    onPress={handleSubmit}
                    />
            </View>
            </SafeAreaView>
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    button1: {
      backgroundColor: 'blue',
    },
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