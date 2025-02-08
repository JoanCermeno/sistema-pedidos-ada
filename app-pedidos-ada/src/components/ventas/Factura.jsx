import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePostRequest } from "../../hooks/usePostRequest";
import { dateToYyyyMmDd, dateToHhMmSs } from "../../utils/dateUtil";
import Swal from "sweetalert2";
import { use } from "react";
const Factura = ({ productos = [], onProductosSeleccionados }) => {
  const [total, setTotal] = useState(0);
  const [totalBs, setTotalBs] = useState(0);
  const { callApi, loading, response, error } = usePostRequest(); //solo para el envio de datos
  const [nombreCliente, setNombreCliente] = useState("");
  const [cedula, setCedula] = useState("");

  // Calcular total cuando cambia el array de productos
  useEffect(() => {
    const valorDolar = parseFloat(localStorage.getItem("dolar")) || 1; // Valor por defecto 1
    const nuevoTotal = productos.reduce(
      (sum, item) => sum + (item.subtotal || 0),
      0
    );
    const nuevoTotalBs = (nuevoTotal * valorDolar).toFixed(2);

    setTotal(nuevoTotal);
    setTotalBs(nuevoTotalBs);
  }, [productos]);

  const handleCantidad = (e, id) => {
    const cantidad = parseInt(e.target.value, 10);
    const nuevosProductos = productos.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          cantidad: cantidad,
          subtotal: item.precio * cantidad,
        };
      }
      return item;
    });
    onProductosSeleccionados(nuevosProductos); // <- Actualizar estado padre
  };

  const eliminarProducto = (id) => {
    const nuevosProductos = productos.filter((item) => item.id !== id);
    onProductosSeleccionados(nuevosProductos); // <- Actualizar estado padre
  };

  const handleDecrementar = (id) => {
    const nuevosProductos = productos.map((item) => {
      if (item.id === id && item.cantidad > 1) {
        return {
          ...item,
          cantidad: item.cantidad - 1,
          subtotal: item.precio * (item.cantidad - 1),
        };
      }
      return item;
    });
    onProductosSeleccionados(nuevosProductos); // <- Actualizar estado padre
  };

  const handleIncrementar = (id) => {
    const nuevosProductos = productos.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          cantidad: item.cantidad + 1,
          subtotal: item.precio * (item.cantidad + 1),
        };
      }
      return item;
    });
    onProductosSeleccionados(nuevosProductos); // <- Actualizar estado padre
  };
  const handleLimpiar = () => {
    onProductosSeleccionados([]);
  };
  const handleGuardar = async (e) => {
    e.preventDefault();
    if (loading) {
      console.warn("Ya se está guardando una venta");
      return;
    }
    if (nombreCliente === "" || cedula === "" || productos.length === 0) {
      Swal.fire({
        title: "Error",
        text: "No puedes guardar una venta sin nombre cliente, cedula o productos",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Guardar venta
    //debe seguir el siguiente formato
    // {
    //   "total": "150.50",
    //   "detalles": [
    //     {
    //       "producto_id": "1",
    //       "cantidad": "2",
    //       "precio": "50.00",
    //       "precio_bs": "500.00",
    //       "subtotal": "100.00"
    //     },
    //     {
    //       "producto_id": "2",
    //       "cantidad": "1",
    //       "precio": "50.50",
    //       "precio_bs": "505.00",
    //       "subtotal": "50.50"
    //     }
    //   ]
    // }
    const data = {
      nombre_cliente: nombreCliente,
      cedula: cedula,
      fecha: dateToYyyyMmDd(new Date()) + " " + dateToHhMmSs(new Date()),
      total: total,
      total_bs: totalBs,
      detalles: productos.map((item) => {
        return {
          producto_id: item.id,
          cantidad: item.cantidad,
          precio: item.precio,
          precio_bs: item.precio_bs,
          subtotal: item.subtotal,
        };
      }),
    };
    //enviar a la api
    try {
      console.log(data);
      // Llamar a la API
      await callApi("/venta", data);

      // Si no hay error, mostrar alerta de éxito
      if (!error) {
        console.log(response);
        Swal.fire({
          title: "Venta guardada",
          text: "La venta ha sido guardada con éxito",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Reiniciar los valores del formulario
        handleLimpiar();
      }
    } catch (err) {
      // Si hay un error, mostrar alerta de error
      Swal.fire({
        title: "Error",
        text: err.message || "Ocurrió un problema al guardar la venta",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };
  return (
    <>
      <div className="w-full flex flex-col gap-4 justify-start items-start p-10">
        <header className="flex flex-col gap-2 items-center justify-end w-full">
          <section className="flex flex-row gap-2 items-center justify-end w-full">
            <h1 className="text-md mb-4 text-center">Datos del cliente</h1>

            <label className="input input-bordered input-sm flex items-center w-60 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Jose Perez"
                required
                onChange={(e) => setNombreCliente(e.target.value)}
              />
            </label>
            <label className="input input-bordered input-sm flex items-center w-60 mb-4">
              CI
              <input
                type="text"
                className="pl-2 grow"
                placeholder="V27939124"
                onChange={(e) => setCedula(e.target.value)}
                required
              />
            </label>
          </section>
        </header>

        <div className="overflow-x-auto w-full border border-slate-400 rounded-lg shadow-md">
          {productos.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Quitar</th>

                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <button
                        className="btn btn-outline btn-error btn-sm"
                        onClick={() => eliminarProducto(item.id)} // Llamar a la función eliminarProducto
                      >
                        X
                      </button>
                    </td>

                    <td>
                      {item.nombre}
                      <small className="text-sm text-gray-500">
                        <br />
                        {item.descripcion}
                      </small>
                    </td>
                    <td>
                      ${item.precio.toFixed(2)}
                      <small className="text-sm text-gray-500">
                        <br />
                        {item.precio_bs}Bs.
                      </small>
                    </td>

                    <td className="flex">
                      <div className="join w-full">
                        <button
                          className="btn btn-outline btn-sm join-item btn-error"
                          onClick={() => handleDecrementar(item.id)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="input input-bordered input-sm join-item max-w-12"
                          value={item.cantidad}
                          min={1}
                          onChange={(e) => handleCantidad(e, item.id)}
                        />
                        <button
                          className="btn btn-outline btn-sm join-item btn-success"
                          onClick={() => handleIncrementar(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      ${item.subtotal.toFixed(2)}
                      <small className="text-sm text-gray-500">
                        <br />
                        {(item.precio_bs * item.cantidad).toFixed(2)}Bs.
                      </small>
                    </td>
                  </tr>
                ))}

                {/* Fila del total */}
                <tr className="bg-slate-50">
                  <th colSpan="4" className="text-right">
                    <h1 className="text-2xl font-bold mb-4 text-right">
                      Total
                    </h1>
                  </th>
                  <td className="font-bold">
                    ${total.toFixed(2)}
                    <small className="text-sm text-gray-500">
                      <br />
                      {totalBs}Bs.
                    </small>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-2xl font-bold text-center text-gray-400">
                Factura Vacia
              </h1>
              <small className="text-sm text-gray-400">
                Ver todas las facturas en
              </small>
              <a href="/ventas" className="link link-neutral text-center">
                ventas
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-end w-full gap-5">
          <button className="btn btn-md  " onClick={handleLimpiar}>
            Limpiar
          </button>
          <button
            className={`btn btn-primary btn-md font-bold `}
            onClick={handleGuardar}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <span>Guardar factura</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Factura;
