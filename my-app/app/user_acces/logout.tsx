import { StyleSheet, Button } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


const HomeScreen = () => {
    const router = useRouter();
    const deleteToken = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/');
    };

    return (
        <ThemedView style={styles.body}>
            <ThemedView style={styles.inscriptionContainer}>
                <Button
                    onPress={deleteToken}
                    title="se déconnecter"
                    color="#E82754"
                    accessibilityLabel="Clicker pour se déconnecter"
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
});

export default HomeScreen