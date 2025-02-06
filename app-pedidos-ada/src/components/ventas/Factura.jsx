import React, { useState, useEffect } from "react";

const Factura = ({  productos = [] , onProductosSeleccionados }) => {

  const [total, setTotal] = useState(0);
  const [totalBs, setTotalBs] = useState(0);



  // Calcular total cuando cambia el array de productos
  useEffect(() => {
    const valorDolar = parseFloat(localStorage.getItem("dolar")) || 1; // Valor por defecto 1
    const nuevoTotal = productos.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const nuevoTotalBs = (nuevoTotal * valorDolar).toFixed(2);
    
    setTotal(nuevoTotal);
    setTotalBs(nuevoTotalBs);
  }, [productos]);

  const handleCantidad = (e, id) => {
    const cantidad = parseInt(e.target.value, 10);
    const nuevosProductos = productos.map(item => {
      if (item.id === id) {
        return {
          ...item,
          cantidad: cantidad,
          subtotal: item.precio * cantidad
        };
      }
      return item;
    });
    onProductosSeleccionados(nuevosProductos); // <- Actualizar estado padre
  };
  
  const eliminarProducto = (id) => {
    const nuevosProductos = productos.filter(item => item.id !== id);
    onProductosSeleccionados(nuevosProductos); // <- Actualizar estado padre
  };
  
  const handleDecrementar = (id) => {
    const nuevosProductos = productos.map(item => {
      if (item.id === id && item.cantidad > 1) {
        return {
          ...item,
          cantidad: item.cantidad - 1,
          subtotal: item.precio * (item.cantidad - 1)
        };
      }
      return item;
    });
    onProductosSeleccionados(nuevosProductos); // <- Actualizar estado padre
  };
  
  const handleIncrementar = (id) => {
    const nuevosProductos = productos.map(item => {
      if (item.id === id) {
        return {
          ...item,
          cantidad: item.cantidad + 1,
          subtotal: item.precio * (item.cantidad + 1)
        };
      }
      return item;
    });
    onProductosSeleccionados(nuevosProductos); // <- Actualizar estado padre
  };
  const handleLimpiar = () => {
    onProductosSeleccionados([]);
  };
  const handleGuardar = () => {
   
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
              <input type="text" className="grow" placeholder="Jose Perez" />
            </label>
            <label className="input input-bordered input-sm flex items-center w-60 mb-4">
              C.I:
              <input
                type="text"
                className="pl-2 grow"
                placeholder="V27939124"
              />
            </label>
          </section>
        </header>

        <div className="overflow-x-auto w-full">
          {
            productos.length > 0 ? (
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
                    Total General
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
            </table>):(
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold text-center">No hay productos para mostrar</h1>
              </div>
            )
          }
        </div>
        <div className="flex flex-row justify-end w-full gap-5">
          <button className="btn btn-sm  " onClick={handleLimpiar}>
            Limpiar
          </button>
          <button className="btn btn-success btn-sm font-bold text-white " onClick={handleGuardar}>
            Guardar factura
          </button>
        </div>
      </div>
    </>
  );
};

export default Factura;
