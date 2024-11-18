// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import Agregarpaciente from './src/screens/Agregarpaciente';
import ListaDepaciente from './src/screens/ListaDepaciente';
import DetallePacienteScreen from './src/screens/DetallePacienteScreen';
import Graficos from './src/screens/Graficos';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
        <Stack.Screen name="Agregarpaciente" component={Agregarpaciente} options={{ title: 'Agregar Paciente' }} />
        <Stack.Screen name="ListaDepaciente" component={ListaDepaciente} options={{ title: 'Lista de Pacientes' }} />
        <Stack.Screen name="DetallePacienteScreen" component={DetallePacienteScreen} options={{ title: 'Detalle del Paciente' }} />
        <Stack.Screen name="Graficos" component={Graficos} options={{ title: 'Estadísticas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
