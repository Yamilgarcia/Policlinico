import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';

const PacienteDetailScreen = ({ route, navigation }) => {
  const { pacienteId } = route.params;
  const [paciente, setPaciente] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para los campos editables
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');

  useEffect(() => {
    const fetchPaciente = async () => {
      const docRef = doc(db, "pacientes", pacienteId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPaciente(data);
        setNombre(data.nombrePaciente);
        setApellido(data.apellidoPaciente);
        setEdad(data.edad.toString()); // Convertir a string
        setPeso(data.peso.toString()); // Convertir a string
        setFotoPerfil(data.fotoPerfil);
      }
    };
    fetchPaciente();
  }, [pacienteId]);

  const handleDeletePaciente = async () => {
    await deleteDoc(doc(db, "pacientes", pacienteId));
    navigation.navigate('PacienteList');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdatePaciente = async () => {
    try {
      const docRef = doc(db, "pacientes", pacienteId);
      await updateDoc(docRef, {
        nombrePaciente: nombre,
        apellidoPaciente: apellido,
        edad: Number(edad),
        peso: Number(peso),
        fotoPerfil: fotoPerfil,
      });
      Alert.alert("Éxito", "Datos del paciente actualizados exitosamente");
      setIsEditing(false); // Desactiva el modo de edición
    } catch (error) {
      console.error("Error al actualizar los datos del paciente: ", error);
      Alert.alert("Error", "No se pudieron actualizar los datos. Intenta de nuevo.");
    }
  };

  // Función para seleccionar una nueva imagen
  const seleccionarImagen = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      const selectedImageUri = resultado.assets[0].uri;
      setFotoPerfil(selectedImageUri); // Actualiza la URI de la imagen
      setIsEditing(true); // Habilita el modo de edición al seleccionar una imagen
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {paciente ? (
        <>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.noImageText}>No hay imagen disponible</Text>
          )}
          <TouchableOpacity onPress={seleccionarImagen} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Cambiar Imagen</Text>
          </TouchableOpacity>
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
          <Text style={styles.label}>Peso</Text>
          <TextInput 
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
            editable={isEditing}
          />
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
        <Text>Cargando...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  noImageText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 10,
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
    borderRadius: 5,
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
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PacienteDetailScreen;
