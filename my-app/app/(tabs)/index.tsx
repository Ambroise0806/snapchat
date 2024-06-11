import { StyleSheet, Button } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '@env';

type RootStackParamList = {
    "register": { string: string } | undefined;
    "login": { string: string } | undefined;
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

                    accessibilityLabel="Clicker pour se connecter"
                />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    //real color snap 
    // jaune => #F4F01B
    // bleu => #3CB2E2
    // rouge => #E82754
    body: {
        justifyContent: 'center',
        width: '100%',
        height: '120%',
        backgroundColor: '#F4F01B'
    },
    titleContainer: {
        top: 75,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    inscriptionContainer: {
        bottom: 5,
        gap: 8,
        marginBottom: 8,
        backgroundColor: '#E82754',
    },
    connexionContainer: {
        bottom: 5,
        gap: 8,
        marginBottom: 8,
        backgroundColor: '#3CB2E2',
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});

export default HomeScreen