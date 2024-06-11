// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_KEY } from '@env';
// import {
//   FlatList,
//   SafeAreaView,
//   Text,
//   TouchableOpacity,
// } from 'react-native';

// type ItemData = {
//   id_snap: string;
//   username: string;
//   date: string;
// };

// type Snap = {
//   _id: string;
//   date: string;
//   from: string;
// };

// type ItemProps = {
//   item: ItemData;
//   onPress: () => void;
//   backgroundColor: string;
//   textColor: string;
// };

// const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
//   <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
//     <Text style={[styles.title, { color: textColor }]}>{item.username}</Text>
//   </TouchableOpacity>
// );

// const App: React.FC = () => {
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [data, setData] = useState([]);
//   const [snaps, setSnaps] = useState<Snap[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const getUsers = async () => {
//     const token = await AsyncStorage.getItem('token');
//     if (token != null) {
//       try {
//         const response = await fetch('https://snapchat.epidoc.eu/snap', {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "X-API-Key": API_KEY,
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const json = await response.json();
//         setData(json.data);
//       } catch (error) {
//         console.error(error);
//         setError("Failed to fetch users");
//       }
//     } else {
//       setError("No token found");
//     }
//   };

//   useEffect(() => {
//     getUsers();
//   }, []);

//   const renderItem = ({ item }: { item: ItemData }) => {
//     const backgroundColor = item.id_snap === selectedId ? '#E82754' : '#3CB2E2';
//     const color = item.id_snap === selectedId ? 'white' : 'black';
//     return (
//       <Item
//         item={item}
//         onPress={() => setSelectedId(item.id_snap)}
//         backgroundColor={backgroundColor}
//         textColor={color}
//       />
//     );
//   };

//   useEffect(() => {
//     data.forEach(async (snap: Snap) => {
//       if (snap.from != null) {
//         try {
//           const token = await AsyncStorage.getItem('token');
//           const response = await fetch(`https://snapchat.epidoc.eu/user/${snap.from}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               "X-API-Key": API_KEY,
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           const json = await response.json();
//           setSnaps(json.data);
//         } catch (error) {
//           console.error(error);
//           setError("Failed to fetch users");
//         }
//       } else {
//         setError("No token found");
//       }
//     });
//   }, [data]);

//   for (let index = 0; index < snaps.length; index++) {
//   }

//   console.log(snaps)
//   return (
//     <SafeAreaView style={styles.containerList}>
//       {error ? (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={snapInfos}
//           renderItem={renderItem}
//           keyExtractor={item => item.id_snap}
//           extraData={selectedId}
//         />
//       )}
//     </SafeAreaView>
//   );

// };

// const styles = StyleSheet.create({
//   containerList: {
//     flex: 1,
//     marginTop: 10,
//   },
//   item: {
//     padding: 20,
//     marginVertical: 8,
//     marginHorizontal: 16,
//   },
//   title: {
//     fontSize: 18,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 18,
//     color: 'red',
//   },
// });

// export default App;