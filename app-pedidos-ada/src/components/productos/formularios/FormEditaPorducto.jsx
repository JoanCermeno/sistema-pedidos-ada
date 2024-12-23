import React, { useState } from "react";
import BarcodeScanner from "../../BarcodeScanner"; // Componente del lector de código de barras
import Swal from "sweetalert2";
///cargando el servicio a la api del backend
import { actualizarProducto } from "./../service/Productos";
const EditarProducto = ({ productoToEditar, onClose }) => {
  const [mostrarScanner, setMostrarScanner] = useState(true); // Estado para el scanner
  const [producto, setProducto] = useState(productoToEditar);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //MAndando a editar
    console.log("MAndado a guardar A EDITAR ES:", producto);
    //llamamos a la api

    const resultado = await actualizarProducto(producto);
    if (resultado == 1) {
      Swal.fire({
        title: "Producto actualizado!",
        text: "todo ah salido bien! :D",
        icon: "success",
        timer: 4000, // Tiempo en milisegundos
        timerProgressBar: true,
      }).then(() => {
        // Llamamos a onClose después de la alerta
        if (onClose) onClose();
      });
    } else {
      Swal.fire({
        title: "Ups Ocurrio un problema",
        text: "no te preocupes joan se encargara de todo :)",
        icon: "error", // Tipos: "success", "error", "warning", "info", "question"
        confirmButtonText: "nawr que broma...",
      });
    }
  };

  const handleCodigoBarrasEscaneado = (codigo) => {
    setProducto({ ...producto, codigoBarras: codigo });
    setMostrarScanner(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control my-4 flex flex-row justify-between">
        <label className="label">
          Código de Barras <span className="text-gray-500">(Opcional)</span>
        </label>
        {mostrarScanner && (
          <BarcodeScanner
            onCodigoEscaneado={handleCodigoBarrasEscaneado}
            onCerrar={() => setMostrarScanner(false)}
          />
        )}
        {producto.codigoBarras && (
          <p className="mt-2 text-sm">
            Código escaneado: {producto.codigoBarras}
          </p>
        )}
      </div>
      <div className="form-control mb-2">
        <label className="label">Nombre del Producto</label>
        <input
          type="text"
          name="nombre"
          className="input input-bordered"
          value={producto.nombre}
          onChange={handleChange}
          required
          placeholder="Producto"
        />
      </div>
      <div className="form-control mb-5">
        <label className="label">Descripción</label>
        <textarea
          type="text"
          name="descripcion"
          className="textarea textarea-primary"
          value={producto.descripcion}
          onChange={handleChange}
          required
          placeholder="Ejemplo. Caja de 100 unidades"
        />
      </div>
      <div className="form-control mb-2 flex flex-row justify-between flex-wrap">
        <div className="flex flex-col ">
          <label className="label">Precio ($)</label>
          <input
            type="number"
            name="precio"
            className="input input-bordered"
            value={producto.precio}
            onChange={handleChange}
            required
            placeholder="$"
          />
        </div>

        <div className="flex flex-col ">
          <label className="label">Stock</label>
          <input
            type="number"
            name="stock"
            className="input input-bordered"
            value={producto.stock}
            onChange={handleChange}
            required
            placeholder="unidades"
          />
        </div>
      </div>

      <div className="modal-action flex flex-row justify-start">
        <button type="submit" className="btn btn-primary ">
          Editar
        </button>
        <button
          type="button"
          className="btn btn-neutral"
          onClick={() => setMostrarModal(false)}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarProducto;
