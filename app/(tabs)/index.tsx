import { Image, StyleSheet, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker'; // Importa ImagePicker
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  const [dato, setDato] = useState<string | null>(null); // stato per i dati salvati
  const [img, setImg] = useState<string | null>(null); // stato per il percorso dell'immagine

  const fileUri = FileSystem.documentDirectory + 'example.txt'; // Percorso per un file di testo
  const remoteUri = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffileinfo.com%2Fimg%2Fss%2Fxl%2Fjpg_44-2.jpg&f=1&nofb=1&ipt=4afc36f9058a811bafc93337572077072b18bf56c480bc0e39d7fbe12f59216e&ipo=images'; // URL dell'immagine remota
  const localUri = FileSystem.documentDirectory + 'file.jpg'; // Percorso locale dove salvare l'immagine

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
      setDato(content);
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

  const dowFile = async () => {
    try {
      await FileSystem.downloadAsync(remoteUri, localUri); // Assicurati di avere l'ordine corretto
      setImg(localUri); // Aggiorna lo stato con il percorso locale dell'immagine
      await listFiles();
    } catch (error) {
      console.error('Errore nella download del file:', error);
    }
  };

  const listFiles = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      console.log('File nella directory:', files);
    } catch (error) {
      console.error('Errore nella lettura della directory:', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permesso per accedere alla galleria necessario!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImg(result.assets[0].uri); // Imposta l'URI dell'immagine selezionata
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permesso per accedere alla fotocamera necessario!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImg(result.assets[0].uri); // Imposta l'URI dell'immagine scattata
    }
  };

  useEffect(() => {
    listFiles();
    readFile(); // Chiama readFile senza aspettare il completamento
  }, []);

  return (
      <ParallaxScrollView
          headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
          headerImage={
            img ? (
                <Image source={{ uri: img }} style={styles.reactLogo} />
            ) : null
          }
      >
        <View>
          <Button title="Scrivi File" onPress={writeFile} />
          <Button title="Leggi File" onPress={readFile} />
          <Button title="Cancella File" onPress={deleteFile} />
          <Button title="Scarica File" onPress={dowFile} />
          <Button title="Scegli immagine" onPress={pickImage} />
          <Button title="Scatta foto" onPress={takePhoto} />
          <ThemedText>{dato}</ThemedText>
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
