import { StyleSheet, Button } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import { API_KEY } from '@env';


type Username = {
  id: string;
  username: string;
};

const getData = async () => {
    try {
        const token = await AsyncStorage.getItem('user-infos');
        console.log(token)
        return token;
    } catch (e) {
        console.log('Error when checking the login token =>' + e)
    }
};

const HomeScreen = () => {
    console.log(getData());
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    return (
        <ThemedView style={styles.body}>
            <ThemedView style={styles.inscriptionContainer}>
                <Button
                    onPress={() => navigation.navigate('register')}
                    title="Inscription"
                    color="#ffffff"
                    accessibilityLabel="Clicker pour s'inscrire"
                />
            </ThemedView>
            <ThemedView style={styles.connexionContainer}>
                <Button
                    onPress={() => navigation.navigate('login')}
                    title="Connexion"
                    color="#ffffff"

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