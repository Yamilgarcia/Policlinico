import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { db } from '../firebase'; // Importa la configuración de Firebase
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore"; // Métodos de Firestore para trabajar con documentos
import * as ImagePicker from 'expo-image-picker'; // Librería de Expo para seleccionar imágenes

/**
 * DetallePacienteScreen
 * 
 * Este componente muestra los detalles de un paciente específico, permitiendo al usuario:
 * - Ver la información del paciente.
 * - Editar los datos del paciente.
 * - Cambiar la imagen de perfil del paciente.
 * - Eliminar al paciente de la base de datos.
 * 
 * @param {Object} route - Parámetros de navegación.
 * @param {Object} navigation - Objeto de navegación proporcionado por React Navigation.
 */
const DetallePacienteScreen = ({ route, navigation }) => {
  const { pacienteId } = route.params; // Obtiene el ID del paciente desde los parámetros de navegación
  const [paciente, setPaciente] = useState(null); // Estado para almacenar los datos del paciente
  const [isEditing, setIsEditing] = useState(false); // Estado para manejar el modo de edición

  // Estados para los campos editables
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');

  /**
   * useEffect
   * 
   * Ejecuta la función `fetchPaciente` al cargar el componente para obtener los datos
   * del paciente desde Firestore usando el ID proporcionado.
   */
  useEffect(() => {
    const fetchPaciente = async () => {
      const docRef = doc(db, "pacientes", pacienteId); // Referencia al documento en Firestore
      const docSnap = await getDoc(docRef); // Obtiene el documento
      if (docSnap.exists()) {
        const data = docSnap.data(); // Datos del documento
        setPaciente(data);
        setNombre(data.nombrePaciente);
        setApellido(data.apellidoPaciente);
        setEdad(data.edad.toString()); // Convierte la edad a string para el TextInput
        setPeso(data.peso.toString()); // Convierte el peso a string para el TextInput
        setFotoPerfil(data.fotoPerfil);
      }
    };
    fetchPaciente();
  }, [pacienteId]);

  /**
   * handleDeletePaciente
   * 
   * Elimina el paciente de Firestore y regresa a la lista de pacientes.
   */
  const handleDeletePaciente = async () => {
    try {
      await deleteDoc(doc(db, "pacientes", pacienteId)); // Elimina el documento
      Alert.alert("Éxito", "Paciente eliminado exitosamente");
      navigation.navigate('ListaDepaciente'); // Regresa a la lista de pacientes
    } catch (error) {
      console.error("Error al eliminar el paciente: ", error);
      Alert.alert("Error", "No se pudo eliminar el paciente. Intenta de nuevo.");
    }
  };

  /**
   * handleEditToggle
   * 
   * Activa o desactiva el modo de edición.
   */
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  /**
   * handleUpdatePaciente
   * 
   * Actualiza los datos del paciente en Firestore.
   */
  const handleUpdatePaciente = async () => {
    try {
      const docRef = doc(db, "pacientes", pacienteId); // Referencia al documento
      await updateDoc(docRef, {
        nombrePaciente: nombre,
        apellidoPaciente: apellido,
        edad: Number(edad), // Convierte edad a número
        peso: Number(peso), // Convierte peso a número
        fotoPerfil: fotoPerfil, // URL de la imagen
      });
      Alert.alert("Éxito", "Datos del paciente actualizados exitosamente");
      setIsEditing(false); // Desactiva el modo de edición
    } catch (error) {
      console.error("Error al actualizar los datos del paciente: ", error);
      Alert.alert("Error", "No se pudieron actualizar los datos. Intenta de nuevo.");
    }
  };

  /**
   * seleccionarImagen
   * 
   * Permite al usuario seleccionar una imagen desde la galería y actualiza la imagen de perfil.
   */
  const seleccionarImagen = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Permite solo imágenes
      allowsEditing: true, // Permite recortar la imagen
      aspect: [4, 3], // Relación de aspecto
      quality: 1, // Calidad máxima
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      const selectedImageUri = resultado.assets[0].uri; // URI de la imagen seleccionada
      setFotoPerfil(selectedImageUri); // Actualiza la URI de la imagen
      setIsEditing(true); // Activa el modo de edición
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {paciente ? (
        <>
          {/* Muestra la imagen de perfil del paciente */}
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.imagePreview} />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>No hay imagen disponible</Text>
            </View>
          )}
          <TouchableOpacity onPress={seleccionarImagen} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Cambiar Imagen</Text>
          </TouchableOpacity>

          {/* Campos de edición */}
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput 
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            editable={isEditing}
          />
          <Text style={styles.label}>Apellido</Text>
          <TextInput 
            style={styles.input}
            value={apellido}
            onChangeText={setApellido}
            editable={isEditing}
          />
          <Text style={styles.label}>Edad</Text>
          <TextInput 
            style={styles.input}
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
            editable={isEditing}
          />
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput 
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
            editable={isEditing}
          />

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={isEditing ? handleUpdatePaciente : handleEditToggle}>
              <Text style={styles.buttonText}>{isEditing ? 'Guardar Cambios' : 'Editar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePaciente}>
              <Text style={styles.buttonText}>Eliminar Paciente</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.loadingText}>Cargando datos del paciente...</Text>
      )}
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#edf1f7',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#344e5c',
    marginTop: 20,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  noImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8ecef',
    borderRadius: 10,
    marginBottom: 15,
  },
  noImageText: {
    color: '#6b7688',
    fontSize: 14,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DetallePacienteScreen;
