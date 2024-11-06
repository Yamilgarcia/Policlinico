// src/screens/PacienteDetailScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, deleteDoc } from "firebase/firestore";

const PacienteDetailScreen = ({ route, navigation }) => {
  const { pacienteId } = route.params;
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    const fetchPaciente = async () => {
      const docRef = doc(db, "pacientes", pacienteId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPaciente(docSnap.data());
      }
    };
    fetchPaciente();
  }, [pacienteId]);

  const handleDeletePaciente = async () => {
    await deleteDoc(doc(db, "pacientes", pacienteId));
    navigation.navigate('PacienteList');
  };

  return (
    <View style={styles.container}>
      {paciente ? (
        <>
          <Text style={styles.label}>Nombre Completo</Text>
          <Text style={styles.value}>{paciente.nombrePaciente} {paciente.apellidoPaciente}</Text>
          <Text style={styles.label}>Edad</Text>
          <Text style={styles.value}>{paciente.edad}</Text>
          <Text style={styles.label}>Peso</Text>
          <Text style={styles.value}>{paciente.peso} kg</Text>
          <Button title="Eliminar Paciente" onPress={handleDeletePaciente} color="#e74c3c" />
        </>
      ) : (
        <Text>Cargando...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  value: {
    fontSize: 18,
    color: '#333',
  },
});

export default PacienteDetailScreen;
