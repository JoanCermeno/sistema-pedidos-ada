import React from "react";
import Navbar from "../Navbar";
import { useState, useEffect } from "react";
import { useProductManagement } from "../../hooks/useProductManagement";
import Swal from "sweetalert2";
import Factura from "./Factura";

const Sales = () => {
  const page = 1;
  const limit = 20;
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const { obtenerProductos } = useProductManagement();
  const [totalProductos, setTotalProductos] = useState(0);

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
    console.log(productoToAdd);
      // si la propiedad existencia es cero no se agrega al la factura
      if(productoToAdd.stock === 0){
          const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "warning",
                title: 'Producto sin existencia en ele inventario :('
              });
        return;
      }
    // Agregar propiedades cantidad y subtotal
    const productoConDetalles = {
      ...productoToAdd,
      cantidad: 1, // <- Inicializar cantidad
      subtotal: productoToAdd.precio * 1, // <- Calcular subtotal inicial
    };

    if (productoSeleccionado.length === 0) {
      setProductoSeleccionado([productoConDetalles]);
      return;
    }

    if (!productoSeleccionado.find((p) => p.id === productoToAdd.id)) {
      setProductoSeleccionado([...productoSeleccionado, productoConDetalles]); // <- Usar spread correctamente
    } else {
      Swal.fire("Error", "Producto ya existe en la lista", "error");
    }
 
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />
      {/* Contenido */}

      <div className="flex flex-row justify-left w-full px-2">
        <div className="max-w-[60%] flex flex-col gap-2 justify-center px-4 pt-4 rounded-lg border shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Productos Disponibles
          </h1>
          <input
            type="text"
            placeholder="Buscar por Nombre"
            className="input input-bordered input-sm bg-slate-50"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="overflow-auto max-h-screen">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Existencia</th>
                  <th>Agregar</th>
                </tr>
              </thead>
              <tbody>
                {/* row 2 */}
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>
                        {producto.nombre}
                        <small className="text-sm text-gray-500">
                          <br />
                          {producto.descripcion}
                        </small>
                      </td>
                      <td>
                        {producto.precio}$ <br />
                        <small className="text-sm text-gray-500">
                          {producto.precio_bs}Bs.
                        </small>
                      </td>
                      <td>{producto.stock}</td>
                      <th>
                        <button
                          className="btn btn-outline btn-info btn-sm"
                          onClick={() => agregarProductoALaFactura(producto)}
                        >
                          Añadir
                        </button>
                      </th>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-yellow-700 bg-yellow-50"
                    >
                      No se encontraron productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Table de factura  */}
        <Factura
          productos={productoSeleccionado}
          onProductosSeleccionados={setProductoSeleccionado}
        />
      </div>
    </div>
  );
};

export default Sales;
