import React, { useState, useEffect } from "react";
import AgregarProducto from "./formularios/AgregarProducto";
const ProductosTable = () => {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Cantidad de productos por página

  useEffect(() => {
    const fetchProductos = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const tokenOfAuth = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${apiUrl}/productos?page=${page}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${tokenOfAuth}`, // Incluir el token en el encabezado
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setProductos(data.allProductos);
        setTotalPages(Math.ceil(data.total / limit));
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProductos();
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const agregarProductoALaTabla = (nuevoProducto) => {
    setProductos([...productos, nuevoProducto]);
  };

  return (
    <div className="container mx-auto">
      <AgregarProducto onProductoAgregado={agregarProductoALaTabla} />
      <h1 className="text-2xl font-bold text-center mb-4">
        Lista de Productos
      </h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Código</th>
              <th>Código de Barra</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <tr key={producto.codigo}>
                  <td>{producto.codigo}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.precio}</td>
                  <td>{producto.stock}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay productos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4">
        <button
          className="btn btn-outline mr-2"
          disabled={page === 1}
          onClick={handlePreviousPage}
        >
          Anterior
        </button>
        <span className="mx-2">
          Página {page} de {totalPages}
        </span>
        <button
          className="btn btn-outline ml-2"
          disabled={page === totalPages}
          onClick={handleNextPage}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProductosTable;
