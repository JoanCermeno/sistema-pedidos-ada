import React, { useState, useEffect } from "react";
import BarcodeScanner from "../../BarcodeScanner"; // Componente del lector de código de barras
import { useProductManagement } from "../../../hooks/useProductManagement";

const AgregarProducto = ({ onProductoAgregado }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarScanner, setMostrarScanner] = useState(true); // Estado para el scanner
  const [producto, setProducto] = useState({
    codigoBarras: "",
    descripcion: "",
    nombre: "",
    precio_compra: "", // Precio de compra en dólares
    precio_compra_bs: "", // Precio de compra en bolívares (nuevo campo, aunque veo que ya lo manejabas como precio_bs)
    precio_minorista: "", // Precio minorista en dólares (nuevo campo)
    precio_minorista_bs: "", // Precio minorista en bolívares (nuevo campo)
    precio_mayorista: "", // Precio mayorista en dólares (nuevo campo)
    precio_mayorista_bs: "", // Precio mayorista en bolívares (nuevo campo)
    stock: "",
  });
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

  // Cierra el modal de "agregar producto" cuando se presiona la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setMostrarModal(false); // Cierra el modal de "agregar producto"
        }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
}, [setMostrarModal]); // Dependencia: setMostrarModal

  const dolarToday = localStorage.getItem("dolar");
  const { agregarProducto, loading, error } = useProductManagement();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
    if (name === "precio_compra") {
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear objeto con los datos actualizados
    let productoActualizado = {};
    //comparamos si el precio_bs esta vacio (ahora comparamos precio_compra_bs)
    if (producto.precio_compra_bs === "") {
      // Si es vacio, simplemente asignamos el precio calculado a precio_bs (ahora a precio_compra_bs)
      productoActualizado = {
        ...producto,
        precio_compra_bs: (dolarToday * producto.precio_compra).toFixed(2), // Usar precio_compra para calcular precio_compra_bs
      };
    } else {
      // si no  mandamos el objeto con los datos que le asigno el usuario
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
        precio_compra: "",
        precio_compra_bs: "", // Limpiar también precio_compra_bs
        precio_minorista: "", // Limpiar precio_minorista
        precio_minorista_bs: "", // Limpiar precio_minorista_bs
        precio_mayorista: "", // Limpiar precio_mayorista
        precio_mayorista_bs: "", // Limpiar precio_mayorista_bs
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
        Nuevo producto
      </button>

      {mostrarModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <form onSubmit={handleSubmit}>
              <div className="form-control my-4 flex-row justify-between">
                <label className="label">
                  Código de Barras
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

              <div className="form-control flex flex-row justify-between flex-wrap">
                <div className="flex flex-col ">
                  <label className="label text-slate-500">
                    Costo del Producto ($)
                  </label>{" "}
                  {/* Etiqueta más descriptiva */}
                  <input
                    type="number"
                    name="precio_compra" // Usar precio_compra para el precio de compra en dólares
                    step="0.10"
                    min={0}
                    className="input input-bordered text-right"
                    value={producto.precio_compra}
                    onChange={handleChange}
                    required
                    placeholder="0$"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="label text-slate-500 ">(Bs)</label>{" "}
                  {/* Etiqueta más descriptiva */}
                  <input
                    type="number"
                    name="precio_compra_bs" // Usar precio_compra_bs para el precio de compra en bolívares
                    min={0}
                    step="0.1"
                    className="input input-disabled  text-right"
                    value={producto.precio_compra_bs}
                    readOnly={true}
                    onChange={handleChange}
                    disabled
                    placeholder={
                      (dolarToday * producto.precio_compra).toFixed(2) + "Bs"
                    } // Usar precio_compra para calcular placeholder
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
                    step="0.10"
                    min={0}
                    className="input input-bordered text-right "
                    value={producto.precio_minorista}
                    onChange={handleChange}
                    required
                    placeholder="1$"
                  />
                  <progress
                    className="progress progress-accent w-56"
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
                      (dolarToday * producto.precio_minorista).toFixed(2) + "Bs"
                    } // Usar precio_minorista para calcular placeholder
                    disabled
                  />
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="label text-slate-500">
                    Precio venta al Mayor ($)
                  </label>
                  {/* Nueva etiqueta Precio Mayor */}
                  <input
                    type="number"
                    name="precio_mayorista" // Nuevo campo para precio mayorista en dólares
                    step="0.10"
                    min={0}
                    className="input input-bordered text-right"
                    value={producto.precio_mayorista}
                    onChange={handleChange}
                    required
                    placeholder="2$"
                  />
                  <progress
                    className="progress w-56 progress-accent "
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
                      (dolarToday * producto.precio_mayorista).toFixed(2) + "Bs"
                    } // Usar precio_mayorista para calcular placeholder
                    disabled
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
                  value={producto.stock}
                  onChange={handleChange}
                  required
                  placeholder="10"
                />
              </div>
              
            

              <div className="modal-action flex flex-row">
                <button
                  type="button"
                  className="btn warning font-bold flex-grow"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary font-bold flex-grow"
                >
                  Guardar
                  {loading && (
                    <span className="loading loading-spinner loading-sm"></span>
                  )}
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
