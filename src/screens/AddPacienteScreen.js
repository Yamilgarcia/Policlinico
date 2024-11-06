import React, { useState } from 'react';
import { View, Button, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase'; // Asegúrate de que esto apunte a tu configuración de Firebase
import { collection, addDoc, Timestamp } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import InputField from '../components/InputField'; // Asegúrate de que este componente exista

const AddPacienteScreen = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [image, setImage] = useState(null); // Estado para almacenar la URI de la imagen

  // Función para seleccionar imagen
  const seleccionarImagen = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setImage(resultado.assets[0].uri); // Almacena la URI de la imagen seleccionada
    }
  };

  // Función para guardar la imagen localmente
  const saveImageLocally = async (uri) => {
    const fileUri = `${FileSystem.documentDirectory}${nombre}_${apellido}_profile.jpg`; // Cambia el nombre del archivo según el paciente
    try {
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });
      console.log("Imagen guardada localmente:", fileUri);
      return fileUri; // Retorna la ruta donde se guardó la imagen
    } catch (error) {
      console.error("Error al guardar la imagen localmente:", error);
      Alert.alert("Error", "No se pudo guardar la imagen.");
      return null; // Retorna null en caso de error
    }
  };

  const handleSave = async () => {
    if (!nombre || !apellido || !edad || !peso) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    let imagePath = null;
    if (image) {
      imagePath = await saveImageLocally(image); // Guarda la imagen y obtiene la ruta
      if (!imagePath) return; // Si hay error al guardar la imagen, salir de la función
    }

    // Guardar datos del paciente en Firestore
    try {
      await addDoc(collection(db, "pacientes"), {
        nombrePaciente: nombre,
        apellidoPaciente: apellido,
        edad: Number(edad),
        peso: Number(peso),
        fotoPerfil: imagePath || '', // Guarda la ruta de la imagen o un string vacío si no hay imagen
        fechaRegistro: Timestamp.now()
      });
      Alert.alert("Éxito", "Paciente guardado exitosamente");
      // Resetear campos después de guardar
      setNombre('');
      setApellido('');
      setEdad('');
      setPeso('');
      setImage(null);
    } catch (error) {
      console.error("Error al guardar los datos del paciente: ", error);
      Alert.alert("Error", "No se pudo guardar el paciente. Por favor, intenta de nuevo.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Nuevo Paciente</Text>
      <TouchableOpacity onPress={seleccionarImagen} style={styles.imageContainer}>
        <Text>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {/* Vista previa de la imagen seleccionada */}
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <InputField label="Nombre" value={nombre} onChangeText={setNombre} />
      <InputField label="Apellido" value={apellido} onChangeText={setApellido} />
      <InputField label="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" />
      <InputField label="Peso (kg)" value={peso} onChangeText={setPeso} keyboardType="numeric" />

      <View style={styles.buttonContainer}>
        <Button title="Guardar" onPress={handleSave} color="#4CAF50" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#d1e7dd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#344e41',
    borderWidth: 1,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default AddPacienteScreen;
