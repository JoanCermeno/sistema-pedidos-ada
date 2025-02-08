import React, { useState } from "react";
import BarcodeScanner from "../../BarcodeScanner"; // Componente del lector de código de barras
import Swal from "sweetalert2";
//importar el hook de productos
import { useProductManagement } from "../../../hooks/useProductManagement";

const EditarProducto = ({ productoToEditar, onClose }) => {
  const dolarToday = localStorage.getItem("dolar");
  const [mostrarScanner, setMostrarScanner] = useState(true); // Estado para el scanner
  const [producto, setProducto] = useState({...productoToEditar, precio_bs: ""});
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
    let productoActualizado = {};
    //comparamos si el precio_bs esta vacio
    if (producto.precio_bs === "") {
      console.log("ES VERDADERO");
      // Si es vacio, simplemente asignamos el precio calculado a precio_bs
      productoActualizado = {
        ...producto,
        precio_bs: (dolarToday * producto.precio).toFixed(2),
      };
    } else {
      // si no  mandamos el objeto con los datos que le asigno el usuario
      productoActualizado = { ...producto };
    }
    if(productoActualizado.precio_bs === 0){
      //mostrar un toast
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
          icon: "error",
          title: "precio en bolivares no puede ser 0",
        });
      return;
    }
    
    console.log(productoActualizado);
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
          <label className="label">Precio (Bs)</label>
          <input
            type="number"
            name="precio_bs"
            min={0}
            step="0.1"
            className="input input-bordered"
            value={producto.precio_bs}
            onChange={handleChange}
            placeholder={(dolarToday * producto.precio).toFixed(2) + "Bs"}
          />
        </div>

        <div className="flex flex-col ">
          <label className="label">Cantidad</label>
          <input
            type="number"
            name="stock"
            className="input input-bordered"
            value={producto.stock}
            onChange={handleChange}
            required
            placeholder="100"
          />
        </div>
      </div>

      <div className="modal-action flex flex-row justify-start">
        <button type="submit" className="btn btn-accent">
          Editar
          {loading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
        </button>
        <button
          type="button"
          className="btn btn-gost"
          onClick={() => onClose()}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarProducto;
