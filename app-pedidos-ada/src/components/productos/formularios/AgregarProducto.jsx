import React, { useState } from "react";
import BarcodeScanner from "../../BarcodeScanner"; // Componente del lector de código de barras
import { useProductManagement } from "../../../hooks/useProductManagement";



const AgregarProducto = ({ onProductoAgregado }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarScanner, setMostrarScanner] = useState(true); // Estado para el scanner
  const [producto, setProducto] = useState({
    codigoBarras: "",
    descripcion: "",
    nombre: "",
    precio: "",
    precio_bs: "",
    stock: "",
  });
  const dolarToday = localStorage.getItem("dolar");
  const { agregarProducto , loading, error } = useProductManagement();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear objeto con los datos actualizados
    let productoActualizado = {};
    //comparamos si el precio_bs esta vacio
    if (producto.precio_bs === "") {
      // Si es vacio, simplemente asignamos el precio calculado a precio_bs
      productoActualizado = {
        ...producto,
        precio_bs: (dolarToday * producto.precio).toFixed(2),
      };
    }else{
      // si no  mandamos el objeto con los datos que le asigno el usuario
      productoActualizado = { ...producto };
    }
    // agregar el producto

    const resultado = await agregarProducto(productoActualizado);
    console.log(resultado);
    if (resultado) {
             // Llamamos a onClose después de la alerta
             setMostrarModal(false); // Reiniciamos el estado del agregar producto para limpiar los campos
             onProductoAgregado(resultado); // Informar al componente principal que un producto fue agregado   
             //reiniciamos el estado del agregar producto para limpiar los campos
             setProducto({
               codigoBarras: "",
               descripcion: "",
               nombre: "",
               precio: "",
               precio_bs: "",
               stock: "",
             });
             
    }
  };

  const handleCodigoBarrasEscaneado = (codigo) => {
    setProducto({ ...producto, codigoBarras: codigo });
    setMostrarScanner(false);
  };

  return (
    <div>
      <button
        className="btn btn-sm btn-primary font-bold join-item"
        onClick={() => setMostrarModal(true)}
      >
        Nuevo
      </button>

      {mostrarModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Agregar Producto</h3>
            <div className="divider"></div>

            <form onSubmit={handleSubmit}>
              <div className="form-control my-4 flex-row justify-between hidden">
                <label className="label">
                  Código de Barras{" "}
                  <span className="text-gray-500">(Opcional)</span>
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
                  className="input input-bordered "
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
                  className="textarea textarea-primary "
                  value={producto.descripcion}
                  onChange={handleChange}
                  required
                  placeholder="Ejemplo. Caja de 100 unidades"
                />
              </div>
              <div className="form-control mb-2 flex flex-row justify-between flex-wrap">
                <div className="flex flex-col ">
                  <label className="label text-slate-500">Precio ($)</label>
                  <input
                    type="number"
                    name="precio"
                    step="0.10"
                    min={0}
                    className="input input-bordered "
                    value={producto.precio}
                    onChange={handleChange}
                    required
                    placeholder="1$"
                  />
                  <label className="label text-slate-500 ">Precio (Bs)</label>
                  <input
                    type="number"
                    name="precio_bs"
                    min={0}
                    step="0.1"
                    className="input input-bordered "
                    value={producto.precio_bs}
                    onChange={handleChange}
                    placeholder={
                      (dolarToday * producto.precio).toFixed(2) + "Bs"
                    }
                  />
                </div>

                <div className="flex flex-col ">
                  <label className="label text-slate-500">Unidades</label>
                  <input
                    type="number"
                    name="stock"
                    step="0.01"
                    limit={10000}
                    min={0}
                    className="input input-bordered "
                    value={producto.stock}
                    onChange={handleChange}
                    required
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="modal-action flex flex-row justify-start">
                <button type="submit" className="btn btn-primary font-bold">
                  Guardar
                  {loading && (
                    <span className="loading loading-spinner loading-sm"></span>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-gost font-bold"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgregarProducto;
