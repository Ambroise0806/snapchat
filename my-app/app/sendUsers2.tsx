import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import { API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const App = () => {
//   const [data, setData] = useState('');  
//   const getUsers = async () => {
//     const token = await AsyncStorage.getItem('token');
//     if(token != null) {
//       try {
//         const response = await fetch('https://snapchat.epidoc.eu/user' ,{
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "X-API-Key": API_KEY,
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const json = await response.json();
//         const string = JSON.stringify(json)
//         setData(string);
//       } catch (error) {
//         console.error(error);
//       } 
//     }
//   };
  
//   useEffect(() => {
//     getUsers();
//   }, []);
  
//   console.log(data)
//   return (
//     <View style={{flex: 1, padding: 24}}>
//       {(
//         <FlatList
//           data={data}
//           keyExtractor={item => item.id}
//           renderItem={({item}) => (
//             <Text>
//               <Text>Hello, I am your cat!</Text>
//               {item.username}
//             </Text>
//           )}
//         />
//       )}
//     </View>
//   );
// };
// export default App;