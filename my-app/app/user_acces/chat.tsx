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

type Snap = {
    _id: null;
    date: string;
    from: string;
};

type User = {
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
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [snaps, setSnaps] = useState<Snap[]>([]);
    const [data, setData] = useState<ItemData[]>([]);
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

    let array_username: { username: string; }[] = [];

    const getUsers = async (id: string, id_snap: string, date: string) => {
        const token = await AsyncStorage.getItem('token');

        if (token != null) {
            try {
                const response = await fetch(`https://snapchat.epidoc.eu/user/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": API_KEY,
                        Authorization: `Bearer ${token}`,
                    },
                });
                const json = await response.json();
                let obj = {
                    id_snap: id_snap,
                    username: json.data.username,
                    date: date
                }
                array_username.push(obj);
                // console.log('array_users PRINCIPAL ==>', array_username)  
                // console.log('users', users)
                // console.log('users', users.length)
            } catch (error) {
                console.error(error);
                setError(`Failed to fetch users => error: ${error}`);
            }
        } else {
            setError("No token found");
        }
    };

    useEffect(() => {
        snaps.forEach(snap => {
            if (snap.from != null && snap._id != null) {
                getUsers(snap.from, snap._id, snap.date);
            }
            });
            }, [snaps]);
        setUsers(array_username)
        console.log('users', users)
        console.log('users', users.length)
    // console.log('users', users.length)

    // useEffect(() => {
    //     let array_data: { id_snap: null; username: any; date: string; }[] = [];
    //     snaps.forEach(snap => {
    //         if(snap.from != null){
    //             let obj = {    
    //                 id_snap: snap._id,
    //                 username: users.username,
    //                 date: snap.date}
    //             array_data.push(obj);
    //         console.log('Array VF ===> ', obj)
    //         }
    //     });
    //     // setData(array_data);
    // }, []); 


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

    // console.log('snaps', snaps)
    // console.log('data', data)

    return (
        <SafeAreaView style={styles.containerList}>
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id_snap}
                    extraData={selectedId}
                />
            )}
        </SafeAreaView>
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
});

export default App;