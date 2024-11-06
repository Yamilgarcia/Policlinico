import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;

const StatisticsScreen = () => {
  const [dataEdad, setDataEdad] = useState([]);
  const [dataPeso, setDataPeso] = useState([]);
  const [numPacientes, setNumPacientes] = useState(0);

  // Cargar datos desde Firestore
  useEffect(() => {
    const fetchData = async () => {
      const pacientesSnapshot = await getDocs(collection(db, 'pacientes'));
      const pacientes = pacientesSnapshot.docs.map(doc => doc.data());

      // Procesar los datos para el gráfico de edades y peso
      const edades = [];
      const pesos = [];
      pacientes.forEach((paciente) => {
        if (paciente.edad) edades.push(paciente.edad);
        if (paciente.peso) pesos.push(paciente.peso);
      });

      setDataEdad(edades);
      setDataPeso(pesos);
      setNumPacientes(pacientes.length); // Número total de pacientes
    };

    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estadísticas de Pacientes</Text>

      {/* Número Total de Pacientes */}
      <Text style={styles.subtitle}>Número Total de Pacientes: {numPacientes}</Text>

      {/* Gráfico de Barras para Distribución de Edad */}
      <Text style={styles.chartTitle}>Distribución de Edad</Text>
      <BarChart
        data={{
          labels: dataEdad.map((edad, index) => `Edad ${edad}`),
          datasets: [{ data: dataEdad }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        fromZero
      />

      {/* Gráfico de Barras para Distribución de Peso */}
      <Text style={styles.chartTitle}>Distribución de Peso</Text>
      <BarChart
        data={{
          labels: dataPeso.map((peso, index) => `Peso ${peso}kg`),
          datasets: [{ data: dataPeso }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        fromZero
      />
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#FFF',
  backgroundGradientTo: '#FFF',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#344e41',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#344e41',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#344e41',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default StatisticsScreen;
