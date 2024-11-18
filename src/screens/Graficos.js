import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, Button } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const screenWidth = Dimensions.get('window').width;

const Graficos = () => {
  const [dataEdad, setDataEdad] = useState([]);
  const [dataPeso, setDataPeso] = useState([]);
  const [numPacientes, setNumPacientes] = useState(0);
  const [loading, setLoading] = useState(true);

  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pacientesSnapshot = await getDocs(collection(db, 'pacientes'));
        const pacientes = pacientesSnapshot.docs.map(doc => doc.data());

        const edades = [];
        const pesos = [];
        pacientes.forEach((paciente) => {
          if (paciente.edad && typeof paciente.edad === 'number') edades.push(paciente.edad);
          if (paciente.peso && typeof paciente.peso === 'number') pesos.push(paciente.peso);
        });

        setDataEdad(edades);
        setDataPeso(pesos);
        setNumPacientes(pacientes.length);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos. Intenta de nuevo.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieData = [
    { name: 'Menores de 30', population: dataEdad.filter(edad => edad < 30).length, color: '#4CAF50', legendFontColor: '#344e41', legendFontSize: 14 },
    { name: 'Entre 30 y 50', population: dataEdad.filter(edad => edad >= 30 && edad <= 50).length, color: '#FFC107', legendFontColor: '#344e41', legendFontSize: 14 },
    { name: 'Mayores de 50', population: dataEdad.filter(edad => edad > 50).length, color: '#FF5722', legendFontColor: '#344e41', legendFontSize: 14 },
  ];

  const handleDataPointClick = (data) => {
    const { value, index } = data;
    Alert.alert('Información del Punto', `Punto: P${index + 1}\nPeso: ${value} KG`);
  };

  const generatePDF = async () => {
    try {
      const pieChartUri = await captureRef(pieChartRef.current, {
        format: 'png',
        quality: 1,
        result: 'data-uri',
      });

      const lineChartUri = await captureRef(lineChartRef.current, {
        format: 'png',
        quality: 1,
        result: 'data-uri',
      });

      const htmlContent = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #344e41; }
            .chart-title { font-size: 18px; font-weight: bold; color: #344e41; margin: 20px 0 10px; }
            .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            img { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Estadísticas de Pacientes</h1>
          <p>Total de Pacientes: <strong>${numPacientes}</strong></p>

          <h2 class="chart-title">Distribución por Edad</h2>
          <ul>
            ${pieData.map(item => `<li>${item.name}: ${item.population} pacientes</li>`).join('')}
          </ul>

          <h2 class="chart-title">Distribución de Peso</h2>
          <table class="data-table">
            <thead>
              <tr><th>Punto</th><th>Peso (kg)</th></tr>
            </thead>
            <tbody>
              ${dataPeso.map((peso, index) => `<tr><td>P${index + 1}</td><td>${peso}</td></tr>`).join('')}
            </tbody>
          </table>

          <h2 class="chart-title">Gráficos</h2>
          <img src="${pieChartUri}" style="width: 100%; max-width: 600px;" />
          <img src="${lineChartUri}" style="width: 100%; max-width: 600px;" />
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('PDF Generado', `Archivo PDF creado en ${uri}`);
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estadísticas de Pacientes</Text>

      {loading ? (
        <Text style={styles.loadingText}>Cargando datos...</Text>
      ) : (
        <>
          <View style={styles.statContainer}>
            <Text style={styles.statLabel}>Total de Pacientes</Text>
            <Text style={styles.statValue}>{numPacientes}</Text>
          </View>

          <Text style={styles.chartTitle}>Distribución por Edad</Text>
          <View ref={pieChartRef} collapsable={false}>
            <PieChart
              data={pieData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
              absolute
            />
          </View>

          <Text style={styles.chartTitle}>Distribución de Peso</Text>
          <View ref={lineChartRef} collapsable={false}>
            <LineChart
              data={{
                labels: dataPeso.map((_, index) => `P${index + 1}`),
                datasets: [{ data: dataPeso }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              onDataPointClick={handleDataPointClick}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Generar y Compartir PDF" onPress={generatePDF} color="#4CAF50" />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(53, 126, 56, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#edf1f7',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#344e41',
    marginBottom: 20,
    textAlign: 'center',
  },
  statContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
    borderRadius: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#6b7688',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#344e41',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Graficos;
