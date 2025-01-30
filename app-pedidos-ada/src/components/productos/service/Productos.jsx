const apiUrl = import.meta.env.VITE_API_URL;

export const obtenerProductos = async (page, limit, searchTerm, token) => {
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
  console.log(response.status);
  if (response.status === 401) {
    console.warn("No tienes permisos para acceder a este recurso");
    throw new Error("No tienes permisos para acceder a este recurso");
  }
  return response.json();
};

export const eliminarProducto = async (id, token) => {
  return await fetch(`${apiUrl}/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const actualizarProducto = async (productoToEditar) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${apiUrl}/producto`, {
    method: "PUT",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json", // Importante para que el servidor interprete el JSON
    },
    body: JSON.stringify(productoToEditar), // Convierte el objeto a JSON
  });
  const resultado = response.json();
  return resultado;
};
