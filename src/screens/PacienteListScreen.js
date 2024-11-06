// src/screens/PacienteListScreen.js

import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import PacienteCard from '../components/PacienteCard';

const PacienteListScreen = ({ navigation }) => {
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      const querySnapshot = await getDocs(collection(db, "pacientes"));
      setPacientes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPacientes();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PacienteCard
            nombre={item.nombrePaciente}
            apellido={item.apellidoPaciente}
            onPress={() => navigation.navigate('PacienteDetail', { pacienteId: item.id })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default PacienteListScreen;
