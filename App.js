// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import AddPacienteScreen from './src/screens/AddPacienteScreen';
import PacienteListScreen from './src/screens/PacienteListScreen';
import PacienteDetailScreen from './src/screens/PacienteDetailScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
        <Stack.Screen name="AddPaciente" component={AddPacienteScreen} options={{ title: 'Agregar Paciente' }} />
        <Stack.Screen name="PacienteList" component={PacienteListScreen} options={{ title: 'Lista de Pacientes' }} />
        <Stack.Screen name="PacienteDetail" component={PacienteDetailScreen} options={{ title: 'Detalle del Paciente' }} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Estadísticas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
