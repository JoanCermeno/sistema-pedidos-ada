import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useGetRequest } from "../../hooks/useGetRequest.js";
import {convertirHora24a12 , yyyyMmDdToDdMmYyyy} from "../../utils/dateUtil";
const TablaVentas = () => {
  const { callApiGet, loading, error, response } = useGetRequest();
  const [ventas, setVentas] = useState([]);

  // Pedir las ventas a la API
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const data = await callApiGet("/venta");
        console.log(data);
        setVentas(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVentas();
  }, []);

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

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Contenido */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tabla de ventas</h1>

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
      </div>
    </>
  );
};

export default TablaVentas;