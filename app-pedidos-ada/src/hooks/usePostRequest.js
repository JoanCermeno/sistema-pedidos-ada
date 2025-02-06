// usePostRequest.js
import { useState } from 'react';

export const usePostRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const callApi = async (url, body, headers = {}) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token'); // Si necesitas autenticación
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          ...headers,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setResponse(data);
      return data;

    } catch (err) {
      setError(err.message || 'Ocurrió un error en la petición');
      throw err; // Para manejar el error en el componente si es necesario
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error, response };
};