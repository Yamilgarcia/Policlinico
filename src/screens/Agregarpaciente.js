import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Diseñoscajita from '../components/Diseñoscajita';
import LottieView from 'lottie-react-native';

const Agregarpaciente = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [image, setImage] = useState(null);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const seleccionarImagen = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setImage(resultado.assets[0].uri);
    }
  };

  const saveImageLocally = async (uri) => {
    const fileUri = `${FileSystem.documentDirectory}${nombre}_${apellido}_profile.jpg`;
    try {
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });
      return fileUri;
    } catch (error) {
      console.error("Error al guardar la imagen localmente:", error);
      Alert.alert("Error", "No se pudo guardar la imagen.");
      return null;
    }
  };

  const handleSave = async () => {
    if (!nombre || !apellido || !edad || !peso) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    let imagePath = null;
    if (image) {
      imagePath = await saveImageLocally(image);
      if (!imagePath) return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, "pacientes"), {
        nombrePaciente: nombre,
        apellidoPaciente: apellido,
        edad: Number(edad),
        peso: Number(peso),
        fotoPerfil: imagePath || '',
        fechaRegistro: Timestamp.now(),
      });

      setSuccessAnimation(true);
      setTimeout(() => {
        setSuccessAnimation(false);
        setIsLoading(false);
        setNombre('');
        setApellido('');
        setEdad('');
        setPeso('');
        setImage(null);
      }, 3000);
    } catch (error) {
      console.error("Error al guardar los datos del paciente: ", error);
      Alert.alert("Error", "No se pudo guardar el paciente. Por favor, intenta de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Paciente</Text>

      {successAnimation && (
        <View style={styles.animationContainer}>
          <LottieView
             source={require('../../assets/animacion/Animation - 1731980497412.json')}
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <Text style={styles.successText}>¡Paciente registrado con éxito!</Text>
        </View>
      )}

      {!successAnimation && (
        <>
          <TouchableOpacity onPress={seleccionarImagen} style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imageText}>Seleccionar Imagen</Text>
            )}
          </TouchableOpacity>

          <Diseñoscajita label="Nombre" value={nombre} onChangeText={setNombre} />
          <Diseñoscajita label="Apellido" value={apellido} onChangeText={setApellido} />
          <Diseñoscajita label="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" />
          <Diseñoscajita label="Peso (kg)" value={peso} onChangeText={setPeso} keyboardType="numeric" />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2faff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#eaf5fc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 65,
    borderColor: '#4a90e2',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
  },
  imageText: {
    color: '#4a90e2',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  successText: {
    color: '#4a90e2',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Agregarpaciente;
