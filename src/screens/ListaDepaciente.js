import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { db } from '../firebase'; // Importación de la configuración de Firebase
import { collection, getDocs } from "firebase/firestore"; // Métodos de Firestore para obtener datos
import PacienteCard from '../components/PacienteCard'; // Componente que muestra las tarjetas de pacientes

/**
 * ListaDepaciente
 * 
 * Este componente muestra una lista de pacientes obtenida desde Firestore.
 * Incluye una funcionalidad para refrescar automáticamente la lista cuando la pantalla vuelve a enfocarse.
 * 
 * @param {Object} props.navigation - Objeto de navegación proporcionado por React Navigation.
 */
const ListaDepaciente = ({ navigation }) => {
  const [pacientes, setPacientes] = useState([]); // Estado para almacenar los datos de los pacientes

  /**
   * fetchPacientes
   * 
   * Función que obtiene la lista de pacientes desde la colección "pacientes" en Firestore
   * y actualiza el estado con los datos obtenidos.
   */
  const fetchPacientes = async () => {
    try {
      // Obtiene todos los documentos de la colección "pacientes"
      const querySnapshot = await getDocs(collection(db, "pacientes"));
      // Mapea los documentos para extraer su ID y datos
      setPacientes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error al obtener los pacientes: ", error);
    }
  };

  /**
   * useEffect
   * 
   * Llama a `fetchPacientes` al montar el componente para obtener la lista inicial.
   * Agrega un listener para refrescar la lista cuando la pantalla se enfoca.
   */
  useEffect(() => {
    fetchPacientes(); // Llama a la función para obtener los pacientes

    // Agrega un listener para ejecutar fetchPacientes cuando la pantalla se enfoca
    const unsubscribe = navigation.addListener('focus', fetchPacientes);

    // Limpia el listener al desmontar el componente
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Encabezado de la lista */}
      <Text style={styles.headerText}>Gestión de Pacientes</Text>

      {/* Lista de pacientes */}
      <FlatList
        data={pacientes} // Datos de los pacientes
        keyExtractor={(item) => item.id} // Clave única para cada elemento
        renderItem={({ item }) => (
          <PacienteCard
            nombre={item.nombrePaciente} // Propiedad del nombre del paciente
            apellido={item.apellidoPaciente} // Propiedad del apellido del paciente
            imagen={item.fotoPerfil} // Propiedad de la imagen del paciente
            // Navega a la pantalla DetallePacienteScreen pasando el ID del paciente
            onPress={() => navigation.navigate('DetallePacienteScreen', { pacienteId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContainer} // Estilo del contenedor de la lista
      />
    </View>
  );
};

/**
 * Estilos del componente
 * 
 * Define el diseño y estilo de los elementos de la pantalla.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    backgroundColor: '#edf1f7', // Color de fondo suave y profesional
    paddingHorizontal: 15, // Espaciado horizontal
  },
  headerText: {
    fontSize: 28, // Tamaño del texto del encabezado
    fontWeight: 'bold', // Peso de la fuente
    color: '#344e5c', // Color del texto
    marginVertical: 20, // Espaciado superior e inferior
    textAlign: 'center', // Alineación centrada
    textTransform: 'uppercase', // Transformación de texto en mayúsculas
    letterSpacing: 1, // Espaciado entre letras
  },
  listContainer: {
    paddingBottom: 20, // Espaciado inferior para la lista
  },
});

export default ListaDepaciente;
