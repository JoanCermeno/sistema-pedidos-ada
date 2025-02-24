import React, { useState, useEffect } from "react";
import BarcodeScanner from "../../BarcodeScanner";
import Swal from "sweetalert2";
import { useProductManagement } from "../../../hooks/useProductManagement";

const EditarProducto = ({ productoToEditar, onClose }) => {
  const dolarToday = localStorage.getItem("dolar");
  console.log(productoToEditar);
  const [mostrarScanner, setMostrarScanner] = useState(true);
  // Inicializar el estado del producto con los valores de productoToEditar o valores vacíos si productoToEditar es null/undefined
  const [producto, setProducto] = useState(productoToEditar); 
  const { actualizarProducto, loading, error } = useProductManagement();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
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
        title: "Espera un momento, estoy actualizando el producto",
      });
      console.log("Estoy cargando");
      return;
    }


   const productoActualizado = { ...producto };

    try {
      const resultado = await actualizarProducto(productoActualizado);
      console.log(resultado);
      Swal.fire({
        title: "Producto actualizado!",
        icon: "success",
        timer: 4000, // Tiempo en milisegundos
        timerProgressBar: true,
      }).then(() => {
        // Llamamos a onClose después de la alerta
        if (onClose) onClose();
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Ups Ocurrio un problema",
        text: "no te preocupes joan se encargara de todo :)",
        icon: "error",
        confirmButtonText: "nawr que broma...",
      });
    }
  };

  const handleCodigoBarrasEscaneado = (codigo) => {
    setProducto({ ...producto, codigoBarras: codigo });
    setMostrarScanner(false);
  };

  const [margenMinorista, setMargenMinorista] = useState(0);
  const [margenMayorista, setMargenMayorista] = useState(0);
  // Función para calcular el margen de ganancia
  const calcularMargenGanancia = (precioVenta, precioCosto) => {
    if (!precioVenta || !precioCosto || precioVenta <= 0) {
      return 0;
    }
    const ganancia = precioVenta - precioCosto;
    const margen = (ganancia / precioVenta) * 100;
    return margen.toFixed(2);
  };

  useEffect(() => {
    const precioCompra = parseFloat(producto.precio_compra) || 0; // Convertir a número, 0 si es vacío o inválido
    const precioMinorista = parseFloat(producto.precio_minorista) || 0;
    const precioMayorista = parseFloat(producto.precio_mayorista) || 0;

    const nuevoMargenMinorista = calcularMargenGanancia(
      precioMinorista,
      precioCompra
    );
    const nuevoMargenMayorista = calcularMargenGanancia(
      precioMayorista,
      precioCompra
    );

    setMargenMinorista(nuevoMargenMinorista);
    setMargenMayorista(nuevoMargenMayorista);
  }, [
    producto.precio_compra,
    producto.precio_minorista,
  producto.precio_mayorista,
  ]);

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
          placeholder={productoToEditar?.nombre || "Nombre del Producto"} // Placeholder con valor actual o texto por defecto
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
          placeholder={
            productoToEditar?.descripcion || "Ejemplo. Caja de 100 unidades"
          } // Placeholder con valor actual o texto por defecto
        />
      </div>

      {/**datos a editar */}
      <div className="form-control flex flex-row justify-between flex-wrap">
        <div className="flex flex-col ">
          <label className="label text-slate-500">Costo del Producto ($)</label>{" "}
          {/* Etiqueta más descriptiva */}
          <input
            type="number"
            name="precio_compra" // Usar precio_compra para el precio de compra en dólares
            step="0.10"
            min={0}
            className="input input-bordered text-right"
            value={producto.precio_compra}
            onChange={handleChange}
            placeholder={productoToEditar?.precio_compra}
          />
        </div>

        <div className="flex flex-col">
          <label className="label text-slate-500">(Bs)</label>{" "}
          {/* Etiqueta más descriptiva */}
          <input
            type="number"
            name="precio_compra_bs" // Usar precio_compra_bs para el precio de compra en bolívares
            min={0}
            step="0.1"
            className="input input-disabled text-right"
            readOnly={true}
            placeholder={(producto.precio_compra !== "") ? (dolarToday * producto.precio_compra).toFixed(2) + "Bs" : ""} // Usar precio_compra para calcular placeholder
          />
        </div>
      </div>
      <div className="form-control flex flex-row justify-between flex-wrap">
        <div className="flex flex-col gap-2">
          <label className="label text-slate-500">
            Precio venta al detal ($)
          </label>
          {/* Nueva etiqueta Precio Detal */}
          <input
            type="number"
            name="precio_minorista" // Nuevo campo para precio minorista en dólares
            step="0.01"
            min={0}
            className="input input-bordered text-right "
            value={producto.precio_minorista}
            onChange={handleChange}
            placeholder={productoToEditar?.precio_minorista} // Usar precio_compra para calcular placeholder
          />
          <progress
            className="progress w-56 progress-accent"
            value={margenMinorista}
            max="100"
          ></progress>
          <small className="text-slate-500">
            Margen de ganancia ({margenMinorista}%)
          </small>
        </div>

        <div className="flex flex-col gap-2">
          <label className="label text-slate-500 "> (Bs)</label>{" "}
          {/* Nueva etiqueta Precio Detal */}
          <input
            type="number"
            name="precio_minorista_bs" // Nuevo campo para precio minorista en bolívares
            min={0}
            step="0.1"
            className="input input-disabled text-right "
            value={producto.precio_minorista_bs}
            onChange={handleChange}
            readOnly={true}
            placeholder={
              (dolarToday * productoToEditar.precio_minorista).toFixed(2) + "Bs"
            } // Usar precio_minorista para calcular placeholder
          />
        </div>

        <div className="flex flex-col gap-2 ">
          <label className="label text-slate-500">
            Precio venta al Mayor ($)
          </label>{" "}
          {/* Nueva etiqueta Precio Mayor */}
          <input
            type="number"
            name="precio_mayorista" // Nuevo campo para precio mayorista en dólares
            step="0.10"
            min={0}
            className="input input-bordered text-right"
            value={producto.precio_mayorista}
            onChange={handleChange}
            placeholder={productoToEditar.precio_mayorista}
          />
          <progress
            className="progress w-56 progress-accent"
            value={margenMayorista}
            max="100"
          ></progress>
          <small>Margen de ganancia ({margenMayorista}%)</small>
        </div>

        <div className="flex flex-col gap-2">
          <label className="label text-slate-500 ">(Bs)</label>{" "}
          {/* Nueva etiqueta Precio Mayor */}
          <input
            type="number"
            name="precio_mayorista_bs" // Nuevo campo para precio mayorista en bolívares
            min={0}
            step="0.1"
            className="input input-disabled text-right"
            value={producto.precio_mayorista_bs}
            onChange={handleChange}
            placeholder={
              (dolarToday * productoToEditar.precio_mayorista).toFixed(2) + "Bs"
            } // Usar precio_mayorista para calcular placeholder
          />
        </div>
      </div>

      <div className="flex flex-col ">
        <label className="label text-slate-500">Unidades</label>
        <input
          type="number"
          name="stock"
          step="0.01"
          limit={10000}
          min={0}
          className="input input-bordered  text-right"
          placeholder={productoToEditar.stock}
          value={producto.stock}
          onChange={handleChange}
        />
      </div>

      <div className="modal-action flex flex-row w-full">
        <button
          type="button"
          className="btn btn-gost flex-grow"
          onClick={() => onClose()}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-accent flex-grow">
          Editar
          {loading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditarProducto;
