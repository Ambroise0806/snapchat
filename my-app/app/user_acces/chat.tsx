import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '@env';
import {
    FlatList,
    SafeAreaView,
    Text,
    TouchableOpacity,
} from 'react-native';

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
    _id: null;
    date: string;
    from: string;
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
                setError("Failed to fetch users");
            }
        } else {
            setError("No token found");
        }
    };

    useEffect(() => {
        getSnaps();
    }, []);

    const getAllUsers = async () => {
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
        return json.data
    }

    const getUsers = (users: Array<UserData>, id: string, id_snap: string, date: string): ItemData | undefined => {
        try {
            const foundUser: UserData | undefined = users.find((user) => user._id == id)
            if (foundUser != undefined) {
                return {
                    id_snap: id_snap,
                    username: foundUser.username,
                    date: date
                }
            }
        } catch (error) {
            console.error(error);
            setError(`Failed to fetch users => error: ${error}`);
        }
    };

    const getAllUsernames = () => {
        snaps.forEach(async snap => {
            if (snap.from != null && snap._id != null) {
                const formattedDate = snap.date.replace('T', ' ').substring(0, 19)
                const foundUser: ItemData | undefined = getUsers(await getAllUsers(), snap.from, snap._id, formattedDate)
                if (foundUser !== undefined) {
                    setUsers(prev => [...prev, foundUser])
                }
            }
        });
    }

    useEffect(() => {
        if (snaps.length == 0) {
            return
        }
        getAllUsernames()
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

    console.log(selectedId)
    return (
        <View style={styles.body}>
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
            </SafeAreaView>
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
});

export default App;