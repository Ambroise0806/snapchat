import { View, Text, Button, StyleSheet,FlatList, SafeAreaView, TouchableOpacity,Alert } from 'react-native';
import { API_KEY } from '@env';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const Friends = () => {
    const [data, setData] = useState<ItemData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const getFriends = async () => {
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
                setError("Failed to show users");
            }
        } else {
            setError("No token found");
        }
    };

    useEffect(() => {
        getFriends();
    }, []);

    const postFriends = async () => {
        const token = await AsyncStorage.getItem('token');
        const donnees = { "friendId": selectedId };

            try {
                const response = await fetch('https://snapchat.epidoc.eu/user/friends', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": API_KEY,
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(donnees),
                });
                const json = await response.json();
                setData(json.data);
                console.log(response)
                if (response.status === 400){
                    setError(json.data);
                    Alert.alert("Echec de la demande d'ami", '')  
                  }else{
                    Alert.alert("Demande envoyé", '')  
                    getFriends()
                  }
            } catch (error) {
                console.error(error);
            }
        };

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

    return (
        <View style={styles.container}>
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
            </SafeAreaView>
            <View style={styles.button1}>
                <Button
                    title="Ajouter"
                    onPress={postFriends}
                    />
            </View>
            </View>)}

export default Friends;

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
