import React, { useState, useEffect } from "react";
import AgregarProducto from "./formularios/AgregarProducto";
import BarcodeScanner from "../BarcodeScanner";
import Swal from "sweetalert2";
import ImportarProductos from "./ImportarProductos";
const ProductosTable = () => {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalProductos, setTotalProductos] = useState("0");

  const limit = 20; // Cantidad de productos por página
  //solicitar a la base de datos
  const fetchProductos = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const tokenOfAuth = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${apiUrl}/productos?page=${page}&limit=${limit}&search=${searchTerm}`,
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
      setTotalProductos(data.total);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [page, searchTerm]);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const agregarProductoALaTabla = (nuevoProducto) => {
    setProductos([...productos, nuevoProducto]);
    Swal.fire({
      title: "¡Éxito!",
      text: `Producto con ID ${nuevoProducto.id} agregado correctamente.`,
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  };

  const buscarPor = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda
    setPage(1); // Reinicia la paginación a la primera página
  };

  const handleCodigoEscaneado = (codigo) => {
    console.log("Código recibido desde el escáner:", codigo);
    setSearchTerm(codigo);
  };

  return (
    <div className="container mx-auto">
      <section className="fluid border p-5 rounded">
        {/* titulo de la tabla */}
        <div className="flex flex-row gap-1">
          <h1 className="text-2xl font-bold text-left  mb-4">Productos</h1>
          <small className="">
            {totalProductos > 0 ? totalProductos : "0"}
          </small>
        </div>
        {/* controles de la tabla filtros busqueda etc */}
        <div className="flex flex-row grow gap-2 items-center">
          <AgregarProducto onProductoAgregado={agregarProductoALaTabla} />
          <BarcodeScanner onCodigoEscaneado={handleCodigoEscaneado} />
          <button>Subir un listado de productos</button>
          <input
            type="text"
            className="input input-bordered input-sm w-full max-w-xs"
            placeholder="Buscar "
            onChange={buscarPor}
          />
        </div>
      </section>
      <div className="overflow-x-auto ">
        <table className="table w-full table-sm table-zebra table-pin-rows overflow-auto">
          <thead>
            <tr>
              <th>id</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>codigo de barras</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.codigo_barra}</td>
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
          className="btn btn-sm  mr-2"
          disabled={page === 1}
          onClick={handlePreviousPage}
        >
          Anterior
        </button>
        <span className="mx-2">
          Página {page} de {totalPages}
        </span>
        <button
          className="btn btn-sm  ml-2"
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
