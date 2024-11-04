import {Image, StyleSheet, Platform, View, Button} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useEffect, useState} from "react";
import * as FileSystem from 'expo-file-system';

export default function HomeScreen() {
  const [dato, setDato] = useState<string | null>(null); // stato per i dati salvati

  const fileUri = FileSystem.documentDirectory + 'example.txt';

    const writeFile = async () => {
      const content = 'Hello, world!';
      try {
        await FileSystem.writeAsStringAsync(fileUri, content);
        console.log('File scritto con successo:', fileUri);
      } catch (error) {
        console.error('Errore nella scrittura del file:', error);
      }
    };

    const readFile = async () => {
      try {
        const content = await FileSystem.readAsStringAsync(fileUri);
        setDato(content)
        console.log('Contenuto del file:', content);
      } catch (error) {
        console.error('Errore nella lettura del file:', error);
      }
    };
  const deleteFile = async () => {
    try {
      await FileSystem.deleteAsync(fileUri);
      console.log('File cancellato con successo:', fileUri);
      setDato(null); // Resetta lo stato dato dopo la cancellazione
    } catch (error) {
      console.error('Errore nella cancellazione del file:', error);
    }
  };
  const listFiles = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      console.log('File nella directory:', files);
      // Puoi anche impostare un array di file nello stato per mostrarli nell'interfaccia utente
    } catch (error) {
      console.error('Errore nella lettura della directory:', error);
    }
  };
  useEffect(() => {
    listFiles()
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <View>
        <Button title="Scrivi File" onPress={writeFile} />
        <Button title="Leggi File" onPress={readFile} />
        <Button title="Cancella File" onPress={deleteFile} />

        <ThemedText> {dato}</ThemedText>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
