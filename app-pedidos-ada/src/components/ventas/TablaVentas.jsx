import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useGetRequest } from "../../hooks/useGetRequest.js";
import {convertirHora24a12 , yyyyMmDdToDdMmYyyy} from "../../utils/dateUtil";
const TablaVentas = () => {
  const { callApiGet, loading, error, response } = useGetRequest();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [ventas, setVentas] = useState([]);
  const limit = 20; // Productos por página
  // Pedir las ventas a la API
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const data = await callApiGet(`/venta?page=${page}&limit=${limit}&search=${searchTerm}`);
        console.log(data);
        setVentas(data.ventas);
        setTotalPages(Math.ceil(data.totalVentas / limit));
        setPage(data.paginaActual);

      } catch (error) {
        console.log(error);
      }
    };
    console.log(ventas);

    fetchVentas();
  }, [page, searchTerm]);

  // Estado para manejar qué filas están expandidas
  const [expandedRows, setExpandedRows] = useState([]);

  // Función para expandir/colapsar una fila
  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };


  // Cambiar a la página anterior
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Cambiar a la página siguiente
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Contenido */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Registro de ventas</h1>
        <div className="flex flex-row gap-1">
        <label className="input input-sm input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Nombre del cliente"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>

        {loading && <p>Cargando ventas...
            <span className="loading loading-spinner loading-sm"></span>
          </p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Tabla de ventas */}
        <div className="overflow-x-auto ">
          <table className="table w-full">
            {/* Encabezado de la tabla */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Cédula</th>
                <th>Fecha</th>

                <th>Total ($)</th>
                <th>Total (Bs)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            {/* Cuerpo de la tabla */}
            <tbody>
              {ventas.map((venta) => (
                <React.Fragment key={venta.id}>
                  {/* Fila principal */}
                  <tr
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleRow(venta.id)}
                  >
                    <td>{venta.id}</td>
                    <td>{venta.nombre_cliente}</td>
                    <td>{venta.cedula}</td>
                    <td> {yyyyMmDdToDdMmYyyy(venta.fecha.split(' ')[0])}
                      <br />
                      <small className="text-sm text-gray-500">
                      {convertirHora24a12(venta.fecha.split(' ')[1])}
                      </small>
                    </td>
                
                    <td>${venta.total.toFixed(2)}</td>
                    <td>{venta.total_bs.toFixed(2)} Bs</td>
                    <td>
                      <button
                        className="btn btn-sm btn-gost cursor-pointer"
                        onClick={() => toggleRow(venta.id)}
                      >
                        {expandedRows.includes(venta.id) ? "Ocultar" : "Ver detalles"}
                      </button>
                    </td>
                  </tr>
                  {/* Fila expandible con detalles */}
                  {expandedRows.includes(venta.id) && (
                    <tr>
                      <td colSpan="7">
                        <div className="p-4 bg-gray-50">
                          <h2 className="font-bold mb-2">Detalles de la venta</h2>
                          <table className="table w-full">
                            <thead>
                              <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio ($)</th>
                                <th>Precio (Bs)</th>
                                <th>Subtotal ($)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {venta.detalles.map((detalle) => (
                                <tr key={detalle.id}>
                                  <td>{detalle.producto_nombre}
                                    <small className="text-sm text-gray-500">
                                      <br />
                                      {detalle.producto_descripcion}
                                    </small>
                                  </td>
                                  <td>{detalle.cantidad}</td>
                                  <td>${detalle.precio.toFixed(2)}</td>
                                  <td>{detalle.precio_bs.toFixed(2)} Bs</td>
                                  <td>${detalle.subtotal.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        <div className="flex justify-center items-center my-10">
        <button
          className="btn btn-sm mr-2"
          disabled={page === 1}
          onClick={handlePreviousPage}
        >
          Anterior
        </button>
        <span className="mx-2">
          Página {page} de {totalPages}
        </span>
        <button
          className="btn btn-sm ml-2"
          disabled={page === totalPages}
          onClick={handleNextPage}
        >
          Siguiente
        </button>
      </div>
      </div>
    </>
  );
};

export default TablaVentas;