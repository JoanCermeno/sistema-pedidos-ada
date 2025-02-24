import { useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export const useProductManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerProductos = async (page, limit, searchTerm, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${apiUrl}/productos?page=${page}&limit=${limit}&search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) { // Mejor manejo de errores
        const errorData = await response.json(); // Intenta obtener detalles del error del servidor
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err; // Re-lanza el error para que el componente lo maneje si es necesario
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/producto/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return response.json(); // O puedes simplemente retornar response.ok
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarProducto = async (productoToEditar) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/producto/${productoToEditar.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productoToEditar),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //agregar producto
  const agregarProducto = async (producto) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/producto`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };  

  return { obtenerProductos, eliminarProducto, actualizarProducto, agregarProducto, loading, error };
};