import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native'; // Animaciones

const DetallePacienteScreen = ({ route, navigation }) => {
  const { pacienteId } = route.params;
  const [paciente, setPaciente] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      const docRef = doc(db, "pacientes", pacienteId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPaciente(data);
        setNombre(data.nombrePaciente);
        setApellido(data.apellidoPaciente);
        setEdad(data.edad.toString());
        setPeso(data.peso.toString());
        setFotoPerfil(data.fotoPerfil);
      }
    };
    fetchPaciente();
  }, [pacienteId]);

  const handleDeletePaciente = async () => {
    try {
      setIsDeleting(true); // Inicia animación
      await deleteDoc(doc(db, "pacientes", pacienteId));
      setTimeout(() => {
        setIsDeleting(false); // Termina animación
        Alert.alert("Éxito", "Paciente eliminado exitosamente");
        navigation.navigate('ListaDepaciente');
      }, 3000);
    } catch (error) {
      console.error("Error al eliminar el paciente: ", error);
      Alert.alert("Error", "No se pudo eliminar el paciente. Intenta de nuevo.");
      setIsDeleting(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdatePaciente = async () => {
    try {
      setIsSaving(true); // Inicia animación
      const docRef = doc(db, "pacientes", pacienteId);
      await updateDoc(docRef, {
        nombrePaciente: nombre,
        apellidoPaciente: apellido,
        edad: Number(edad),
        peso: Number(peso),
        fotoPerfil: fotoPerfil,
      });
      setTimeout(() => {
        setIsSaving(false); // Termina animación
        Alert.alert("Éxito", "Datos del paciente actualizados exitosamente");
        setIsEditing(false);
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar los datos del paciente: ", error);
      Alert.alert("Error", "No se pudieron actualizar los datos. Intenta de nuevo.");
      setIsSaving(false);
    }
  };

  const seleccionarImagen = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      const selectedImageUri = resultado.assets[0].uri;
      setFotoPerfil(selectedImageUri);
      setIsEditing(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isSaving ? (
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/animacion/Animation - 1731981360472.json')}
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <Text style={styles.statusText}>Guardando cambios...</Text>
        </View>
      ) : isDeleting ? (
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/animacion/Animation - 1731981786736.json')}
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <Text style={styles.statusText}>Eliminando paciente...</Text>
        </View>
      ) : paciente ? (
        <>
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

          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} editable={isEditing} />
          <Text style={styles.label}>Apellido</Text>
          <TextInput style={styles.input} value={apellido} onChangeText={setApellido} editable={isEditing} />
          <Text style={styles.label}>Edad</Text>
          <TextInput style={styles.input} value={edad} onChangeText={setEdad} keyboardType="numeric" editable={isEditing} />
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput style={styles.input} value={peso} onChangeText={setPeso} keyboardType="numeric" editable={isEditing} />

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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0faff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
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
    backgroundColor: '#eaf5fc',
    borderRadius: 10,
    marginBottom: 15,
  },
  noImageText: {
    color: '#4a90e2',
    fontSize: 14,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#4a90e2',
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
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  animation: {
    width: 150,
    height: 150,
  },
  statusText: {
    fontSize: 16,
    color: '#4a90e2',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default DetallePacienteScreen;
