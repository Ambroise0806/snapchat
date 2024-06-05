
import { Image, StyleSheet, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
    return (
        <ThemedView style={styles.body}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome!</ThemedText>
                <HelloWave />
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