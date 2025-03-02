// src/hooks/useBuscarclientesPorCedula.js
import { useState, useEffect } from 'react';

function useBuscarclientesPorCedula() {
  const [cedula, setCedula] = useState(''); // Estado interno del hook para la cédula
  const [clientes, setclientes] = useState(null); // Estado para la información del clientes
  const [error, setError] = useState(''); // Estado para mensajes de error
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar carga (opcional)
  const baseURL = import.meta.env.VITE_API_URL;  // URL base de la API
  const token = localStorage.getItem('token'); // Obtener token de autenticación
  useEffect(() => {
    if (cedula) { // Solo hacer la búsqueda si la cédula no está vacía
      setError(''); // Limpiar errores previos
      setclientes(null); // Limpiar clientes anterior
      setIsLoading(true); // Indicar que la búsqueda está en curso

      const buscarclientes = async () => {

        try {
          const response = await fetch(`${baseURL}/cliente/${cedula}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `${token}` : '', // Incluir token si existe
            },
          }); // ¡Asegúrate de que la ruta sea correcta!
          if (!response.ok) {
            setIsLoading(false); // Fin de la carga (incluso si hubo error)
            if (response.status === 404) {
              setclientes(null);
              setError('clientes no encontrado. Por favor, verifica la cédula o añade un nuevo nombre de clientes.');
            } else {
              throw new Error(`Error HTTP! estado: ${response.status}`);
            }
            return;
          }
          const data = await response.json();
          setIsLoading(false); // Fin de la carga con éxito
          setclientes(data); // Guardar la información del clientes
        } catch (error) {
          setIsLoading(false); // Fin de la carga (incluso si hubo error)
          console.error('Error al buscar clientes por cédula en custom hook:', error);
          setError('Error al buscar clientes. Por favor, intenta de nuevo.');
          setclientes(null);
        }
      };

      buscarclientes();
    } else {
      setclientes(null);
      setError('');
      setIsLoading(false); // Asegurarse de que isLoading esté en false si la cédula se vacía
    }
  }, [cedula]); // El useEffect se ejecuta cuando 'cedula' cambia

  // Retornar los estados y una función para setear la cédula (puedes renombrar setCedula a setCedulaHook para evitar confusión, o retornar setCedula y renombrar el estado interno a cedulaInterna, etc.)
  return {
    cedula,
    setCedulaHook: setCedula, // Retornar setCedula como setCedulaHook para evitar conflicto de nombres en el componente
    clientes,
    error,
    isLoading,
  };
}

export default useBuscarclientesPorCedula;