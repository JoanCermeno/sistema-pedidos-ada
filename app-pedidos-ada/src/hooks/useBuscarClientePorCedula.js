// src/hooks/useBuscarClientePorCedula.js
import { useState, useEffect } from 'react';

function useBuscarClientePorCedula() {
  const [cedula, setCedula] = useState(''); // Estado interno del hook para la cédula
  const [cliente, setCliente] = useState(null); // Estado para la información del cliente
  const [error, setError] = useState(''); // Estado para mensajes de error
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar carga (opcional)

  useEffect(() => {
    if (cedula) { // Solo hacer la búsqueda si la cédula no está vacía
      setError(''); // Limpiar errores previos
      setCliente(null); // Limpiar cliente anterior
      setIsLoading(true); // Indicar que la búsqueda está en curso

      const buscarCliente = async () => {
        try {
          const response = await fetch(`/api/clientes/buscar-por-cedula/${cedula}`); // ¡Asegúrate de que la ruta sea correcta!
          if (!response.ok) {
            setIsLoading(false); // Fin de la carga (incluso si hubo error)
            if (response.status === 404) {
              setCliente(null);
              setError('Cliente no encontrado. Por favor, verifica la cédula o añade un nuevo nombre de cliente.');
            } else {
              throw new Error(`Error HTTP! estado: ${response.status}`);
            }
            return;
          }
          const data = await response.json();
          setIsLoading(false); // Fin de la carga con éxito
          setCliente(data.cliente); // Guardar la información del cliente
        } catch (error) {
          setIsLoading(false); // Fin de la carga (incluso si hubo error)
          console.error('Error al buscar cliente por cédula en custom hook:', error);
          setError('Error al buscar cliente. Por favor, intenta de nuevo.');
          setCliente(null);
        }
      };

      buscarCliente();
    } else {
      setCliente(null);
      setError('');
      setIsLoading(false); // Asegurarse de que isLoading esté en false si la cédula se vacía
    }
  }, [cedula]); // El useEffect se ejecuta cuando 'cedula' cambia

  // Retornar los estados y una función para setear la cédula (puedes renombrar setCedula a setCedulaHook para evitar confusión, o retornar setCedula y renombrar el estado interno a cedulaInterna, etc.)
  return {
    cedula,
    setCedulaHook: setCedula, // Retornar setCedula como setCedulaHook para evitar conflicto de nombres en el componente
    cliente,
    error,
    isLoading,
  };
}

export default useBuscarClientePorCedula;