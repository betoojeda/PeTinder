import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

const ErrorLogPage = () => {
  const [logContent, setLogContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchErrorLog = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/admin/logs/errors', {
        // Asegurarnos de que Axios trate la respuesta como texto plano
        responseType: 'text',
      });
      setLogContent(response.data);
    } catch (err) {
      setError('No se pudo cargar el log de errores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorLog();
  }, []);

  return (
    <div>
      <h2>Log de Errores del Backend</h2>
      <p>Mostrando las últimas 200 líneas (más recientes primero).</p>
      <button onClick={fetchErrorLog} disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar Log'}
      </button>
      <pre style={{
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        padding: '15px',
        borderRadius: '5px',
        whiteSpace: 'pre-wrap', // Para que el texto se ajuste
        wordWrap: 'break-word',
        maxHeight: '70vh',
        overflowY: 'auto',
        marginTop: '20px',
      }}>
        {loading ? 'Cargando...' : error || logContent}
      </pre>
    </div>
  );
};

export default ErrorLogPage;
