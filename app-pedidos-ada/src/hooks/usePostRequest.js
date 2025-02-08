// usePostRequest.js
import { useState } from 'react';

export const usePostRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState(null);
  const baseURL = import.meta.env.VITE_API_URL;
  const callApi = async (url, body, headers = {}) => {

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token'); // Si necesitas autenticación
      const response = await fetch(`${baseURL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `${token}` : '',
          ...headers,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setResponse(data);
   
      return data;

    } catch (err) {

      setError(err || 'Ocurrió un error en la petición');
      throw err; // Para manejar el error en el componente si es necesario
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error, response };
};