import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import apiClient from '../../services/api'; // Usaremos nuestro apiClient

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatsPage = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/stats/user-registrations');
        const stats = response.data;

        const data = {
          labels: stats.map(s => s.date),
          datasets: [
            {
              label: 'Nuevos Usuarios por Día',
              data: stats.map(s => s.count),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              fill: true,
            },
          ],
        };
        setChartData(data);
      } catch (err) {
        setError('No se pudieron cargar las estadísticas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Registros de Usuarios en los Últimos 30 Días',
      },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Fecha'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Nº de Usuarios'
            },
            beginAtZero: true
        }
    }
  };

  if (loading) return <p>Cargando estadísticas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Estadísticas de la Aplicación</h2>
      {chartData && <Line options={options} data={chartData} />}
    </div>
  );
};

export default StatsPage;
