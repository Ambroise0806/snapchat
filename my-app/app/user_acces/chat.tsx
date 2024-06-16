import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Image, FlatList, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '@env';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';

type RootStackParamList = {
    "friends": { string: string } | undefined;
};

type ItemData = {
    id_snap: string;
    username: string;
    date: string;
};

type UserData = {
    _id: string;
    username: string;
};

type Snap = {
    _id: string | null;
    date: string;
    from: string | null;
};

type ItemProps = {
    item: ItemData;
    onPress: () => void;
    backgroundColor: string;
    textColor: string;
};

const App: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [users, setUsers] = useState<ItemData[]>([]);
    const [snaps, setSnaps] = useState<Snap[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [imageBase64, setimageBase64] = useState<string | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);

    const getSnaps = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token != null) {
            try {
                const response = await fetch('https://snapchat.epidoc.eu/snap', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": API_KEY,
                        Authorization: `Bearer ${token}`,
                    },
                });
                const json = await response.json();
                setSnaps(json.data);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch snaps");
            }
        } else {
            setError("No token found");
        }
    };

    useEffect(() => {
        getSnaps();
    }, [refresh]);

    const getAllUsers = async (): Promise<UserData[]> => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`https://snapchat.epidoc.eu/user/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_KEY,
                Authorization: `Bearer ${token}`,
            },
        });
        const json = await response.json();
        return json.data;
    };

    const getUsers = (users: Array<UserData>, id: string, id_snap: string, date: string): ItemData | undefined => {
        try {
            const foundUser: UserData | undefined = users.find((user) => user._id == id);
            if (foundUser != undefined) {
                return {
                    id_snap: id_snap,
                    username: foundUser.username,
                    date: date
                };
            }
        } catch (error) {
            console.error(error);
            setError(`Failed to fetch users => error: ${error}`);
        }
    };

    const getAllUsernames = async () => {
        const users = await getAllUsers();
        snaps.forEach(snap => {
            if (snap.from != null && snap._id != null) {
                const formattedDate = snap.date.replace('T', ' ').substring(0, 16);
                const foundUser: ItemData | undefined = getUsers(users, snap.from, snap._id, formattedDate);
                if (foundUser !== undefined) {
                    setUsers(prev => [...prev, foundUser]);
                }
            }
        });
    };

    useEffect(() => {
        if (snaps.length > 0) {
            getAllUsernames();
        }
    }, [snaps]);

    const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
            <View style={styles.itemContainer}>
                <Text style={[styles.title, { color: textColor }]}>{item.username}</Text>
                <Text style={[styles.date, { color: textColor }]}>{item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: ItemData }) => {
        const backgroundColor = item.id_snap === selectedId ? '#E82754' : '#3CB2E2';
        const color = item.id_snap === selectedId ? 'white' : 'black';
        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.id_snap)}
                backgroundColor={backgroundColor}
                textColor={color}
            />
        );
    };

    const showSnap = async (): Promise<void> => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`https://snapchat.epidoc.eu/snap/${selectedId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY,
                    Authorization: `Bearer ${token}`,
                },
            });

            const json = await response.json();

            setimageBase64(json.data.image);
            setDuration(json.data.duration);

            setTimeout(() => {
                setimageBase64(null);
                setDuration(null);
            }, 1000 * json.data.duration);

        } catch (error) {
            console.error('Error while fetching the GET/snap/{id}. Error =>', error);
        }
    };

    const snapSeen = async (): Promise<void> => {
        try {
            const token = await AsyncStorage.getItem('token');
            await fetch(`https://snapchat.epidoc.eu/snap/seen/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY,
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers([]);
        } catch (error) {
            console.error('Error while fetching the PUT/snap/seen/{id}. Error =>', error);
        }
    };

    useEffect(() => {
        if (selectedId != null) {
            showSnap();
            snapSeen();
        }
        if (snaps.length > 0) {
            setRefresh(!refresh);
        }
    }, [selectedId]);

    return (
        <View style={styles.body}>
            {!imageBase64 && (
                <SafeAreaView style={styles.containerList}>
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={users}
                            renderItem={renderItem}
                            keyExtractor={item => item.id_snap}
                            extraData={selectedId}
                        />
                    )}
                    <View>
                        <Button
                            title="Amis"
                            onPress={() => navigation.navigate('friends')}
                        />
                    </View>
                </SafeAreaView>
            )}
            {duration && <Text style={styles.duration}>{duration}</Text>}
            {imageBase64 && <Image source={{ uri: imageBase64 }} style={styles.image} />}
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        backgroundColor: '#F4F01B'
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
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
    },
    date: {
        fontSize: 12,
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
    button1: {
        fontSize: 20,
    },
    image: {
        width: '100%',
        height: '90%',
        marginTop: '10%'
    },
    duration: {
        top: 20,
        fontSize: 35
    }
});

export default App;
