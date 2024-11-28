import React, { useState } from "react";

const AgregarProducto = ({ onProductoAgregado }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
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
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://192.168.0.145:3000/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el producto");
      }

      const data = await response.json();
      onProductoAgregado(data.producto); // Informar al componente principal que un producto fue agregado
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setMostrarModal(true)}>
        Agregar Producto
      </button>

      {mostrarModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Agregar nuevo producto</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-2">
                <label className="label">Código de Barras</label>
                <input
                  type="text"
                  name="codigoBarras"
                  className="input input-bordered"
                  value={producto.codigoBarras}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control mb-2">
                <label className="label">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  className="input input-bordered"
                  value={producto.descripcion}
                  onChange={handleChange}
                  required
                />
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
                />
              </div>
              <div className="form-control mb-2">
                <label className="label">Precio</label>
                <input
                  type="number"
                  name="precio"
                  className="input input-bordered"
                  value={producto.precio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control mb-2">
                <label className="label">Stock</label>
                <input
                  type="number"
                  name="stock"
                  className="input input-bordered"
                  value={producto.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-success">
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn btn-error"
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
