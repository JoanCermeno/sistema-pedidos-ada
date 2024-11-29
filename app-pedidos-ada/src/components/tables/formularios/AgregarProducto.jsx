import React, { useState } from "react";
import BarcodeScanner from "./../../BarcodeScanner"; // Componente del lector de código de barras
import Swal from "sweetalert2";

const AgregarProducto = ({ onProductoAgregado }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarScanner, setMostrarScanner] = useState(true); // Estado para el scanner
  const [producto, setProducto] = useState({
    codigoBarras: "",
    descripcion: "",
    nombre: "",
    precio: "",
    stock: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/producto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(producto),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el producto");
      }

      const data = await response.json();
      console.log("espuesta del servidor ", data);
      onProductoAgregado(data); // Informar al componente principal que un producto fue agregado
      setMostrarModal(false);
      // Reiniciamos el estado del agregar producto para limpiar los campos
      setProducto({
        codigoBarras: "",
        descripcion: "",
        nombre: "",
        precio: "",
        stock: "",
      });
      setMostrarScanner(true);
    } catch (error) {
      console.log(producto);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Cerrar",
      });
      console.error("Error al agregar el producto:", error);
    }
  };

  const handleCodigoBarrasEscaneado = (codigo) => {
    setProducto({ ...producto, codigoBarras: codigo });
    setMostrarScanner(false);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setMostrarModal(true)}>
        Nuevo
      </button>

      {mostrarModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">
              Agregar nuevo producto al inventario
            </h3>
            <div className="divider"></div>

            <form onSubmit={handleSubmit}>
              <div className="form-control my-4 flex flex-row justify-between">
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
              <div className="form-control mb-2 flex flex-row justify-between">
                <div className="flex flex-row">
                  <label className="label">Precio ($)</label>
                  <input
                    type="number"
                    name="precio"
                    className="input input-bordered max-w-32"
                    value={producto.precio}
                    onChange={handleChange}
                    required
                    placeholder="$"
                  />
                </div>

                <div className="flex flex-row">
                  <label className="label">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    className="input input-bordered max-w-32"
                    value={producto.stock}
                    onChange={handleChange}
                    required
                    placeholder="unidades"
                  />
                </div>
              </div>

              <div className="modal-action flex flex-row justify-start">
                <button type="submit" className="btn btn-primary">
                  Guardar
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AgregarProducto;
