import React, {useState, useEffect} from 'react';
import { API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.username}</Text>
  </TouchableOpacity>
);

const App = () => {
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
  console.log(data);
  const renderItem = ({item}: {item: ItemData}) => {
    const backgroundColor = item._id === selectedId ? '#6e3b6e' : '#f9c2ff';
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
    <SafeAreaView style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({item})=>(<View>
            <Text>{item.username}</Text>
          </View>)}
          keyExtractor={item => item._id}
          extraData={selectedId}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
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
