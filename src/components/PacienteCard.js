import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Librería para íconos (Expo)

 /**
  * PacienteCard
  * 
  * Componente que representa una tarjeta individual de un paciente.
  * Incluye detalles básicos del paciente como su nombre, apellido, y foto.
  * Implementa un efecto de animación al presionar y utiliza íconos para una apariencia profesional.
  * 
  * @param {string} nombre - Nombre del paciente.
  * @param {string} apellido - Apellido del paciente.
  * @param {string} imagen - URL de la imagen del paciente (opcional).
  * @param {function} onPress - Función que se ejecuta al presionar la tarjeta.
  */
const PacienteCard = ({ nombre, apellido, imagen, onPress }) => {
  const animatedScale = new Animated.Value(1); // Estado animado para controlar la escala

  /**
   * handlePressIn
   * 
   * Maneja el evento de presionar la tarjeta (inicio).
   * Disminuye ligeramente el tamaño de la tarjeta con un efecto de escala.
   */
  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.95, // Reduce el tamaño al 95%
      useNativeDriver: true, // Optimiza la animación con el driver nativo
    }).start();
  };

  /**
   * handlePressOut
   * 
   * Maneja el evento de soltar la tarjeta (fin).
   * Restaura el tamaño de la tarjeta al 100% con un efecto de escala.
   */
  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1, // Restaura el tamaño al 100%
      useNativeDriver: true, // Optimiza la animación con el driver nativo
    }).start();
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: animatedScale }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn} // Activa el efecto de presionar
        onPressOut={handlePressOut} // Activa el efecto de soltar
        onPress={onPress} // Llama a la función proporcionada al presionar
        style={styles.touchable}
      >
        {/* Muestra la imagen del paciente o un ícono predeterminado si no hay imagen */}
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.image} />
        ) : (
          <View style={styles.noImage}>
            <Ionicons name="person-circle" size={50} color="#9aa5b1" />
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{nombre} {apellido}</Text>
          <Text style={styles.details}>Toca para ver detalles</Text>
        </View>
        {/* Ícono de flecha para indicar interactividad */}
        <Ionicons name="chevron-forward" size={24} color="#6b7688" />
      </TouchableOpacity>
    </Animated.View>
  );
};

 /**
  * Estilos del componente
  * 
  * Define el diseño y estilo de los elementos de la tarjeta.
  */
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff', // Fondo blanco para la tarjeta
    borderRadius: 15, // Bordes redondeados
    marginBottom: 15, // Espaciado entre tarjetas
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 5 }, // Desplazamiento de la sombra
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 10, // Radio de desenfoque de la sombra
    elevation: 5, // Sombra en Android
    overflow: 'hidden', // Evita que los elementos sobresalgan
  },
  touchable: {
    flexDirection: 'row', // Disposición horizontal de los elementos
    alignItems: 'center', // Alineación vertical centrada
    padding: 15, // Espaciado interno
  },
  image: {
    width: 60, // Ancho de la imagen
    height: 60, // Altura de la imagen
    borderRadius: 30, // Bordes redondeados para forma circular
    marginRight: 15, // Espaciado entre la imagen y el texto
    borderWidth: 2, // Borde de la imagen
    borderColor: '#4CAF50', // Color del borde de la imagen
  },
  noImage: {
    width: 60, // Ancho del contenedor de la imagen predeterminada
    height: 60, // Altura del contenedor
    borderRadius: 30, // Bordes redondeados
    marginRight: 15, // Espaciado entre el contenedor y el texto
    backgroundColor: '#e8ecef', // Fondo gris claro
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
  },
  infoContainer: {
    flex: 1, // Toma el espacio restante disponible
  },
  name: {
    fontSize: 18, // Tamaño del texto del nombre
    fontWeight: 'bold', // Fuente en negrita
    color: '#333', // Color del texto
    marginBottom: 3, // Espaciado inferior
  },
  details: {
    fontSize: 14, // Tamaño del texto de los detalles
    color: '#6b7688', // Color gris oscuro
  },
});

export default PacienteCard;
