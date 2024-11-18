import React, { useState } from 'react';
import { View, Button, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase'; // Configuración de Firebase
import { collection, addDoc, Timestamp } from "firebase/firestore"; // Métodos de Firestore
import * as ImagePicker from 'expo-image-picker'; // Selector de imágenes de Expo
import * as FileSystem from 'expo-file-system'; // Sistema de archivos de Expo
import Diseñoscajita from '../components/Diseñoscajita'; // Componente personalizado para campos de entrada

/**
 * Agregarpaciente
 * 
 * Componente que permite agregar un nuevo paciente a la base de datos de Firestore.
 * Incluye campos de entrada para nombre, apellido, edad, peso y la opción de seleccionar una imagen.
 */
const Agregarpaciente = () => {
  // Estados para almacenar los valores de los campos y la imagen seleccionada
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [image, setImage] = useState(null); // URI de la imagen seleccionada

  /**
   * seleccionarImagen
   * 
   * Abre la galería de imágenes del dispositivo y permite al usuario seleccionar una imagen.
   * La URI de la imagen seleccionada se almacena en el estado `image`.
   */
  const seleccionarImagen = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Permite solo imágenes
      allowsEditing: true, // Permite recortar la imagen
      aspect: [4, 3], // Relación de aspecto
      quality: 1, // Calidad máxima
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setImage(resultado.assets[0].uri); // Guarda la URI de la imagen seleccionada
    }
  };

  /**
   * saveImageLocally
   * 
   * Guarda la imagen seleccionada en el sistema de archivos local.
   * 
   * @param {string} uri - URI de la imagen seleccionada.
   * @returns {string|null} Ruta donde se guardó la imagen o `null` en caso de error.
   */
  const saveImageLocally = async (uri) => {
    const fileUri = `${FileSystem.documentDirectory}${nombre}_${apellido}_profile.jpg`; // Ruta del archivo
    try {
      await FileSystem.copyAsync({
        from: uri, // Origen de la imagen
        to: fileUri, // Destino del archivo
      });
      console.log("Imagen guardada localmente:", fileUri);
      return fileUri; // Retorna la ruta del archivo
    } catch (error) {
      console.error("Error al guardar la imagen localmente:", error);
      Alert.alert("Error", "No se pudo guardar la imagen.");
      return null; // Retorna `null` si ocurre un error
    }
  };

  /**
   * handleSave
   * 
   * Valida los campos de entrada y guarda los datos del paciente en Firestore.
   * Incluye la opción de guardar la imagen localmente antes de subir los datos.
   */
  const handleSave = async () => {
    // Validación de campos obligatorios
    if (!nombre || !apellido || !edad || !peso) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    let imagePath = null;
    if (image) {
      imagePath = await saveImageLocally(image); // Guarda la imagen localmente
      if (!imagePath) return; // Si falla, detiene la operación
    }

    try {
      // Agrega un nuevo documento a la colección "pacientes"
      await addDoc(collection(db, "pacientes"), {
        nombrePaciente: nombre,
        apellidoPaciente: apellido,
        edad: Number(edad), // Convierte edad a número
        peso: Number(peso), // Convierte peso a número
        fotoPerfil: imagePath || '', // Guarda la ruta de la imagen o un string vacío
        fechaRegistro: Timestamp.now(), // Marca la fecha de registro
      });

      Alert.alert("Éxito", "Paciente guardado exitosamente");

      // Resetea los campos después de guardar
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

      {/* Selector de Imagen */}
      <TouchableOpacity onPress={seleccionarImagen} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imageText}>Seleccionar Imagen</Text>
        )}
      </TouchableOpacity>

      {/* Campos de Entrada */}
      <Diseñoscajita label="Nombre" value={nombre} onChangeText={setNombre} />
      <Diseñoscajita label="Apellido" value={apellido} onChangeText={setApellido} />
      <Diseñoscajita label="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" />
      <Diseñoscajita label="Peso (kg)" value={peso} onChangeText={setPeso} keyboardType="numeric" />

      {/* Botón Guardar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

/**
 * Estilos del Componente
 * 
 * Define el diseño y estilo visual de los elementos.
 */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#edf1f7', // Fondo suave y profesional
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#344e5c',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  imageContainer: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#e8ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60, // Forma circular
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 60, // Imagen circular
  },
  imageText: {
    color: '#6b7688',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Sombra en Android
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Agregarpaciente;
