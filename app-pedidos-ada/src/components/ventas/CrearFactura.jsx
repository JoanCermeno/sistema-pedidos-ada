import React from "react";

import { useState, useEffect } from "react";
import { useProductManagement } from "../../hooks/useProductManagement";
import Swal from "sweetalert2";
import Factura from "./Factura";

const CrearFactura = () => {
  const page = 1;
  const limit = 9;
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { obtenerProductos } = useProductManagement();
  const [totalProductos, setTotalProductos] = useState(0);
  const [productoRecientementeSeleccionado, setProductoRecientementeSeleccionado] = useState(null); // <-- ¡NUEVO ESTADO!

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await obtenerProductos(page, limit, searchTerm, token);
        setProductos(data.allProductos);
        setTotalPages(Math.ceil(data.total / limit));
        setTotalProductos(data.total);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `error al cargar los productos ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    };
    fetchProductos();
  }, [page, searchTerm]);

  const agregarProductoALaFactura = (productoToAdd) => {
    console.warn(productoToAdd);
    if (productoToAdd.stock === 0) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "warning",
        title: "Producto sin existencia en ele inventario :(",
      });
      return;
    }

    setProductoRecientementeSeleccionado(productoToAdd);
  };

  return (
    <div>
      <div className="flex flex-row justify-left w-full px-2">
        <div className="flex w-[40%] flex-col gap-2 justify-center px-4 pt-4 rounded border border-base-300 shadow-lg bg-base-200 ">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Productos Disponibles
          </h1>

          <input
            type="text"
            placeholder="Buscar por Nombre"
            className="input input-bordered input-sm w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="overflow-auto max-h-screen p-2">
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Existencia</th>
                </tr>
              </thead>
              <tbody>
                {/* row 2 */}
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <tr
                      key={producto.id}
                      className="hover:bg-base-300 cursor-pointer"
                      onClick={() => agregarProductoALaFactura(producto)}
                    >
                      <td>
                        {producto.nombre}
                        <small className="text-sm text-gray-500">
                          <br />
                          {producto.descripcion}
                        </small>
                      </td>
                      <td className="text-right">
                        {producto.precio_minorista}$ <br />
                        <small className="text-sm text-gray-500">
                          {producto.precio_minorista_bs}Bs.
                        </small>
                      </td>
                      <td className="text-right">{producto.stock}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div role="alert" className="alert alert-warning">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 shrink-0 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <span>
                          No Se encontraron productos con este criterio de
                          busqueda!
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Table de factura  */}
        <Factura
        productoToAdd={productoRecientementeSeleccionado} 
        />
      </div>
    </div>
  );
};

export default CrearFactura;
