import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import PacienteCard from '../components/PacienteCard';

const ListaDepaciente = ({ navigation }) => {
  const [pacientes, setPacientes] = useState([]); // Datos completos
  const [filteredPacientes, setFilteredPacientes] = useState([]); // Datos filtrados
  const [searchQuery, setSearchQuery] = useState(''); // Texto del buscador

  const fetchPacientes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "pacientes"));
      const pacientesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPacientes(pacientesData);
      setFilteredPacientes(pacientesData); // Inicialmente, todos los datos
    } catch (error) {
      console.error("Error al obtener los pacientes: ", error);
    }
  };

  useEffect(() => {
    fetchPacientes();
    const unsubscribe = navigation.addListener('focus', fetchPacientes);
    return unsubscribe;
  }, [navigation]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPacientes(pacientes); // Restaurar todos los pacientes si no hay texto
    } else {
      const filtered = pacientes.filter((paciente) =>
        paciente.nombrePaciente.toLowerCase().includes(query.toLowerCase()) ||
        paciente.apellidoPaciente.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPacientes(filtered); // Actualizar datos filtrados
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Gestión de Pacientes</Text>

      {/* Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre o apellido"
        value={searchQuery}
        onChangeText={handleSearch}
        clearButtonMode="always"
      />

      {/* Lista de pacientes */}
      <FlatList
        data={filteredPacientes} // Mostrar los pacientes filtrados
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PacienteCard
            nombre={item.nombrePaciente}
            apellido={item.apellidoPaciente}
            imagen={item.fotoPerfil}
            onPress={() => navigation.navigate('DetallePacienteScreen', { pacienteId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron pacientes</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0faff',
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginVertical: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: '#d4e4f4',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4a90e2',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#a1a1a1',
    marginTop: 20,
  },
});

export default ListaDepaciente;
