import React, { useState } from 'react';
import { View, Button, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { db, storage } from '../firebase';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import InputField from '../components/InputField';

const AddPacienteScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [image, setImage] = useState(null); // Estado para almacenar la URI de la imagen
  const [uploading, setUploading] = useState(false);

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

  // Función para subir la imagen a Firebase Storage y guardar datos en Firestore
  const handleAddPaciente = async () => {
    let imageUrl = '';

    if (image) {
      setUploading(true);
      const imageRef = ref(storage, `pacientes/${Date.now()}_profile.jpg`);
      const response = await fetch(image);
      const blob = await response.blob();

      await uploadBytes(imageRef, blob)
        .then(async () => {
          imageUrl = await getDownloadURL(imageRef);
          setUploading(false);
        })
        .catch((error) => {
          console.error("Error al subir la imagen: ", error);
          setUploading(false);
        });
    }

    // Guardar datos del paciente en Firestore
    await addDoc(collection(db, "pacientes"), {
      nombrePaciente: nombre,
      apellidoPaciente: apellido,
      edad: Number(edad),
      peso: Number(peso),
      fotoPerfil: imageUrl,
      fechaRegistro: Timestamp.now()
    });

    Alert.alert("Éxito", "Paciente guardado exitosamente");
    navigation.navigate('PacienteList');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Nuevo Paciente</Text>
      <TouchableOpacity onPress={seleccionarImagen} style={styles.imageContainer}>
        <Image source={require('../../assets/iconos/flecha.png')} style={styles.imageIcon} />
      </TouchableOpacity>
      {/* Vista previa de la imagen seleccionada */}
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <InputField label="Nombre" value={nombre} onChangeText={setNombre} />
      <InputField label="Apellido" value={apellido} onChangeText={setApellido} />
      <InputField label="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" />
      <InputField label="Peso (kg)" value={peso} onChangeText={setPeso} keyboardType="numeric" />

      <View style={styles.buttonContainer}>
        <Button title={uploading ? "Guardando..." : "Guardar Paciente"} onPress={handleAddPaciente} color="#4CAF50" disabled={uploading} />
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
  imageIcon: {
    width: 50,
    height: 50,
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
