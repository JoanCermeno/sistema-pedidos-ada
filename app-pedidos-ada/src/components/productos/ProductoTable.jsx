import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AgregarProducto from "./formularios/AgregarProducto";
import ImportarProductos from "./ImportarProductos";
import FormEditaProducto from "./formularios/FormEditaProducto";
import DropdownActions from "./../menus/DropdownActions";
import { useProductManagement } from "../../hooks/useProductManagement";
import Modal from "./../modales/Modal";
import { useNavigate } from "react-router-dom";

const ProductosTable = () => {
  const navigate = useNavigate(); // Obtenemos la función navigate
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(20); // Productos por página
  const [totalProductos, setTotalProductos] = useState(0);
  const [modalSubirProductos, setModalSubirProductos] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    id: 0
  });
  const [modalEditar, setModalEditar] = useState(false);
  const token = localStorage.getItem("token");
  const { obtenerProductos, eliminarProducto, loading, error } =
    useProductManagement();

  // Obtener productos cuando cambia la página o el término de búsqueda
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await obtenerProductos(page, limit, searchTerm, token);

        setProductos(data.allProductos);
        setTotalPages(Math.ceil(data.total / limit));
        setTotalProductos(data.total);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `error al cargar los productos ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    };
    fetchProductos();
  }, [page, searchTerm, modalEditar, limit]);

  // Cambiar a la página anterior
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Cambiar a la página siguiente
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Agregar un producto a la tabla
  const agregarProductoALaTabla = (nuevoProducto) => {
    console.log(nuevoProducto);
    setProductos([...productos, nuevoProducto]);
    Swal.fire({
      title: "¡Éxito!",
      text: `Producto con ID ${nuevoProducto.producto.id} agregado correctamente.`,
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  };

  // Buscar productos
  const buscarPor = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reiniciar a la primera página al buscar
  };

  // Eliminar un producto
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

  // Editar un producto
  const handleEditar = (producto) => {
    setProductoSeleccionado(producto);
    setModalEditar(true); //abrir el modal de editar
  };

  return (
    <div className="container bg-base-300 p-5 rounded-2xl">
      <section className="fluid pb-5" id="cargo_inventario"></section>
      <section className="fluid pb-5">
        <div className="flex flex-row gap-1">
          <h1 className="text-2xl font-bold text-left mb-4">Vista general</h1>
          <small>{totalProductos > 0 ? totalProductos : "0"}</small>
        </div>
        <div className="flex flex-col md:flex-col lg:flex-row gap-2 lg:justify-between ">
          <div className="flex flex-row join ">
            <AgregarProducto
              className="join-item"
              onProductoAgregado={agregarProductoALaTabla}
            />

            <button
              className="btn btn-sm join-item"
              onClick={() => setModalSubirProductos(true)}
            >
              Cargar productos desde un archivo
            </button>
            <button
              className="btn btn-sm join-item"
              onClick={() => navigate('/audit')}
            >
              Auditoria
            </button>
          </div>

          <div className=" flex flex-row gap-2 items-center ">
            <label className="input input-sm input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Buscar por nombre"
                onChange={buscarPor}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <select
              className="select select-bordered select-sm max-w-xs"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            >
              <option disabled selected>
                Cantidad por página
              </option>
              <option>20</option>
              <option>50</option>
              <option>150</option>
              <option>300</option>
            </select>
          </div>
        </div>
      </section>
      <div className="bg-base-200 p-5"> 
        <div className="overflow-y-hidden pb-20">
          <table className="table table-pin-rows">
            <thead>
              <tr className="text-md font-bold tracking-wide">
                <td>ID</td>
                <th>Nombre y descripcion</th>
                <th>Costo $ / Bs</th>
                <th>Al delta $ / Bs</th>
                <th>Al mayor $ / Bs</th>
                <th>Existencia</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <tr
                    key={producto.id}
                  >
                    <td>
                      <small className="text-sm text-gray-500">
                        {producto.id}
                      </small>
                    </td>

                    <td>
                      {producto.nombre} <br />
                      <small className="text-sm text-gray-500">
                        {producto.descripcion}
                      </small>
                    </td>

                    <td className="text-center">
                      {producto.precio_compra}$ <br />
                      <small className="text-sm text-gray-500">
                        {producto.precio_compra_bs}Bs.
                      </small>
                    </td>

                    <td className="text-center">
                      {producto.precio_minorista}$ <br />
                      <small className="text-sm  text-gray-500">
                        {producto.precio_minorista_bs}Bs.
                      </small>
                    </td>

                    <td className="text-center">
                      {producto.precio_mayorista}$ <br />
                      <small className="text-sm text-gray-500">
                        {producto.precio_mayorista_bs}Bs.
                      </small>
                    </td>

                    <td className="text-center" >{producto.stock}</td>    

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
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal de edición */}
      <Modal
        titulo="Editar Producto"
        isOpen={modalEditar}

        onClose={() => setModalEditar(false)}
      >
        <FormEditaProducto
          productoToEditar={productoSeleccionado}
          onClose={() => setModalEditar(false)} // Aquí pasamos la función para cerrar el modal
        ></FormEditaProducto>
        
      </Modal>

      <div className="flex justify-center items-center my-10">
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
              className="btn btn-secondary btn-sm"
            >
              Cerrar
            </button>
            <ImportarProductos />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosTable;
