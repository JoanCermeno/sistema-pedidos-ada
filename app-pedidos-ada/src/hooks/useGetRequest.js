// useGetRequest.js
import { useState } from 'react';

export const useGetRequest = () => {
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null);     // Estado de error
  const [response, setResponse] = useState(null); // Estado de respuesta
  const baseURL = import.meta.env.VITE_API_URL;  // URL base de la API

  const callApiGet = async (url, headers = {}) => {
    setLoading(true); // Activar estado de carga
    setError(null);   // Limpiar errores anteriores
    setResponse(null); // Limpiar respuestas anteriores

    try {
      const token = localStorage.getItem('token'); // Obtener token de autenticación
      // si no se encuentral, leer desde las .env
      if (!token) {
        const tokenFromEnv = import.meta.env.VITE_API_TOKEN;
        if (tokenFromEnv) {
          localStorage.setItem('token', tokenFromEnv);
        }
      }

      const response = await fetch(`${baseURL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `${token}` : '', // Incluir token si existe
          ...headers, // Headers adicionales
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json(); // Parsear la respuesta a JSON
      setResponse(data); // Guardar la respuesta
      return data; // Retornar la respuesta

    } catch (err) {
      setError(err.message || 'Ocurrió un error en la petición'); // Guardar el error
      throw err; // Lanzar el error para manejarlo en el componente
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  return { callApiGet, loading, error, response }; // Retornar funciones y estados
};