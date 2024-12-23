import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AgregarProducto from "./formularios/AgregarProducto";
import BarcodeScanner from "../BarcodeScanner";
import ImportarProductos from "./ImportarProductos";
import DropdownActions from "./../menus/DropdownActions";
import { obtenerProductos, eliminarProducto } from "./service/Productos";
import Modal from "./../modales/Modal";
import FormEditaPorducto from "./formularios/FormEditaPorducto";

const ProductosTable = () => {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [totalProductos, setTotalProductos] = useState(0);
  const [modalSubirProductos, setModalSubirProductos] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const token = localStorage.getItem("token"); // Se puede mejorar gestionándolo con un contexto de autenticación
  const limit = 20; // Productos por página

  const fetchProductos = async () => {
    try {
      const data = await obtenerProductos(page, limit, searchTerm, token);

      setProductos(data.allProductos);
      setTotalPages(Math.ceil(data.total / limit));
      setTotalProductos(data.total);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al cargar los productos",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [page, searchTerm]);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const agregarProductoALaTabla = (nuevoProducto) => {
    setProductos([...productos, nuevoProducto]);
    Swal.fire({
      title: "¡Éxito!",
      text: `Producto con ID ${nuevoProducto.id} agregado correctamente.`,
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  };

  const buscarPor = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await eliminarProducto(id, token);
        setProductos(productos.filter((producto) => producto.id !== id));
        Swal.fire(
          "Eliminado",
          "El producto fue eliminado correctamente",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
      }
    }
  };

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto); // Guardamos los datos del producto seleccionado
    setModalEditar(true); // Abrimos el modal
  };

  return (
    <div className="container mx-auto">
      <section className="fluid p-5 rounded">
        <div className="flex flex-row gap-1">
          <h1 className="text-2xl font-bold text-left mb-4">Productos</h1>
          <small>{totalProductos > 0 ? totalProductos : "0"}</small>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row gap-2 lg:items-center">
          <div className="flex flex-row gap-2 flex-wrap flex-1">
            <AgregarProducto onProductoAgregado={agregarProductoALaTabla} />
            <BarcodeScanner onCodigoEscaneado={setSearchTerm} />
            <button
              className="btn btn-sm btn-neutral"
              onClick={() => setModalSubirProductos(true)}
            >
              Subir un listado de productos
            </button>
          </div>
          <input
            type="text"
            className="input input-bordered input-sm"
            placeholder="Buscar"
            onChange={buscarPor}
          />
        </div>
      </section>
      <div>
        <table className="table w-full table-sm border table-pin-rows overflow-auto">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Código de barras</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.codigo_barra}</td>
                  <td>{producto.precio}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <DropdownActions
                      id={producto.id}
                      opciones={[
                        {
                          texto: "Editar",
                          accion: () => handleEditar(producto),
                        },
                        {
                          texto: "Eliminar",
                          accion: () => handleEliminar(producto.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay productos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Modal de edición */}
        <Modal
          titulo="Editar Producto"
          isOpen={modalEditar}
          onClose={() => setModalEditar(false)}
        >
          <FormEditaPorducto
            productoToEditar={productoSeleccionado}
            onClose={() => setModalEditar(false)} // Aquí pasamos la función para cerrar el modal
          ></FormEditaPorducto>
        </Modal>
      </div>
      <div className="flex justify-center items-center mt-4">
        <button
          className="btn btn-sm mr-2"
          disabled={page === 1}
          onClick={handlePreviousPage}
        >
          Anterior
        </button>
        <span className="mx-2">
          Página {page} de {totalPages}
        </span>
        <button
          className="btn btn-sm ml-2"
          disabled={page === totalPages}
          onClick={handleNextPage}
        >
          Siguiente
        </button>
      </div>
      {modalSubirProductos && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button
              onClick={() => setModalSubirProductos(false)}
              className="btn btn-ghost absolute right-2 bottom-2"
            >
              Cancelar
            </button>
            <ImportarProductos />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosTable;
