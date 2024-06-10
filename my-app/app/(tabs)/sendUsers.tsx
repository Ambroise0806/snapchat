import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import { API_KEY } from '@env';

type Username = {
  id: string;
  username: string;
};

const App = () => {
  const [data, setData] = useState<Username[]>([]);

  const getUsers = async () => {
    try {
      const response = await fetch('https://snapchat.epidoc.eu/user' ,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        //   Authorization: ,
        },
      });
      const json = await response.json();
      console.log(json)
      setData(json.username);
    } catch (error) {
      console.error(error);
    } 
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <View style={{flex: 1, padding: 24}}>
      {(
        <FlatList
          data={data}
          keyExtractor={({id}) => id}
          renderItem={({item}) => (
            <Text>
              {item.username}
            </Text>
          )}
        />
      )}
    </View>
  );
};

export default App;