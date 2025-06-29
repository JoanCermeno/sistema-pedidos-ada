import React, { useState, useEffect, useCallback, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Componentes hijos (asumiendo que sus rutas son correctas)
import AgregarProducto from "./formularios/AgregarProducto";
import ImportarProductos from "./ImportarProductos";
import FormEditaProducto from "./formularios/FormEditaProducto";
import DropdownActions from "./../menus/DropdownActions";
import Modal from "./../modales/Modal";
import { useProductManagement } from "../../hooks/useProductManagement";

// Iconos para una mejor UI (puedes usar una librería como react-icons)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
    <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
  </svg>
);
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" /></svg>;
const AuditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-1.125 0-2.062.938-2.062 2.063v15.374c0 1.125.938 2.063 2.063 2.063h10.5c1.125 0 2.063-.938 2.063-2.063V8.625c0-.625-.25-1.188-.656-1.594l-4.5-4.5A2.063 2.063 0 0010.125 2.25z" /></svg>;


const ProductosTable = () => {
  const navigate = useNavigate();
  const { obtenerProductos, eliminarProducto, loading, error } = useProductManagement();
  
  // --- ESTADO ---
  const [productos, setProductos] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalProductos: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(20);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Disparador para recargar datos de forma controlada
  const [refetchTrigger, setRefetchTrigger] = useState(0); 
  const triggerRefetch = () => setRefetchTrigger(prev => prev + 1);

  // Referencia para el modal de importación
  const importModalRef = useRef(null);

  const token = localStorage.getItem("token");

  // --- EFECTOS ---
  useEffect(() => {
    const fetchProductos = async () => {
      if (!token) {
        Swal.fire("Error", "No se encontró el token de autenticación.", "error");
        navigate("/login"); // Redirigir si no hay token
        return;
      }
      try {
        const data = await obtenerProductos(pagination.page, limit, searchTerm, token);
        setProductos(data.allProductos);
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(data.total / limit),
          totalProductos: data.total,
        }));
      } catch (err) {
        // El hook `useProductManagement` ya debería manejar el estado de `error`
        // por lo que podemos mostrar el error aquí de forma más limpia.
        console.error("Error al cargar productos:", err);
      }
    };
    fetchProductos();
    // La dependencia 'error' no es necesaria si el hook no lo devuelve como estado actualizable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, searchTerm, limit, refetchTrigger, token, navigate]);

  
  // --- MANEJADORES DE EVENTOS (MEMOIZADOS CON useCallback) ---
  const handlePreviousPage = useCallback(() => {
    setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }));
  }, []);

  const handleNextPage = useCallback(() => {
    setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }));
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPagination(p => ({ ...p, page: 1 })); // Reiniciar a la página 1 al buscar
  }, []);
  
  const handleLimitChange = useCallback((e) => {
    setLimit(Number(e.target.value));
    setPagination(p => ({ ...p, page: 1 })); // Reiniciar a la página 1 al cambiar el límite
  }, []);

  const handleEdit = useCallback((producto) => {
    setProductoSeleccionado(producto);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, ¡eliminar!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarProducto(id, token);
        Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
        triggerRefetch(); // Dispara la recarga de datos
      } catch (err) {
        Swal.fire("Error", `No se pudo eliminar el producto: ${err.message}`, "error");
      }
    }
  }, [eliminarProducto, token]);

  // Callback para cuando se agrega o edita un producto con éxito
  const onActionSuccess = useCallback(() => {
    setIsEditModalOpen(false); // Cierra el modal de edición si está abierto
    triggerRefetch(); // Recarga la lista de productos
    // El mensaje de éxito ahora lo maneja el formulario de Agregar/Editar
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 bg-base-300 rounded-2xl min-h-screen">
      
      {/* --- PANEL DE CONTROL --- */}
      <div className="card bg-base-200 shadow-md mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Gestión de Productos</h1>
              <p className="text-base-content/70">Total de productos: {pagination.totalProductos}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <AgregarProducto onProductoAgregado={onActionSuccess} />
              <button className="btn btn-outline" onClick={() => importModalRef.current.showModal()}>
                <UploadIcon /> Importar
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/audit')}>
                <AuditIcon /> Auditoría
              </button>
            </div>
          </div>
          
          <div className="divider"></div>

          <div className="flex flex-col md:flex-row justify-end items-center gap-4">
            <label className="input input-bordered flex items-center gap-2 w-full md:w-auto">
              <input type="text" className="grow" placeholder="Buscar por nombre o código" onChange={handleSearch} />
              <SearchIcon />
            </label>
            <select className="select select-bordered w-full md:w-auto" value={limit} onChange={handleLimitChange}>
              <option value="20">20 por página</option>
              <option value="50">50 por página</option>
              <option value="150">150 por página</option>
              <option value="300">300 por página</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* --- TABLA DE PRODUCTOS --- */}
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
        <table className="table table-zebra w-full">
          {/* Cabecera de la tabla (visible en desktop) */}
          <thead className="text-base-content/80 uppercase">
            <tr>
              <th>ID / Código</th>
              <th>Producto</th>
              <th className="text-center">Costo</th>
              <th className="text-center">Detal</th>
              <th className="text-center">Mayor</th>
              <th className="text-center">Existencia</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center p-10"><span className="loading loading-spinner loading-lg"></span></td></tr>
            ) : error ? (
              <tr><td colSpan="7" className="text-center p-10 text-error">Error al cargar productos: {error.message}</td></tr>
            ) : productos.length > 0 ? (
              productos.map((producto) => {
                const stockColor = producto.stock > 20 ? "badge-success" : producto.stock > 5 ? "badge-warning" : "badge-error";
                return (
                  <tr key={producto.id} className="hover">
                    {/* ID y Código de Barras */}
                    <td>
                      <div className="font-bold">{producto.id}</div>
                      <div className="text-sm opacity-50">{producto.codigo_barra || "N/A"}</div>
                    </td>
                    {/* Nombre y Descripción */}
                    <td>
                      <div className="font-bold text-base-content">{producto.nombre}</div>
                      <div className="text-sm opacity-70">{producto.descripcion}</div>
                    </td>
                    {/* Precios */}
                    <td className="text-center">${producto.precio_compra}<br/><span className="text-xs opacity-60">{producto.precio_compra_bs} Bs</span></td>
                    <td className="text-center">${producto.precio_minorista}<br/><span className="text-xs opacity-60">{producto.precio_minorista_bs} Bs</span></td>
                    <td className="text-center">${producto.precio_mayorista}<br/><span className="text-xs opacity-60">{producto.precio_mayorista_bs} Bs</span></td>
                    {/* Stock */}
                    <td className="text-center">
                      <span className={`badge ${stockColor} font-bold`}>{producto.stock}</span>
                    </td>
                    {/* Acciones */}
                    <td className="text-center">
                      <DropdownActions
                        opciones={[
                          { texto: "Editar", accion: () => handleEdit(producto) },
                          { texto: "Eliminar", accion: () => handleDelete(producto.id) },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="7" className="text-center p-10">No se encontraron productos que coincidan con la búsqueda.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINACIÓN --- */}
      <div className="flex justify-center items-center my-6">
        <div className="join">
          <button className="join-item btn" disabled={pagination.page === 1} onClick={handlePreviousPage}>«</button>
          <button className="join-item btn">Página {pagination.page} de {pagination.totalPages}</button>
          <button className="join-item btn" disabled={pagination.page === pagination.totalPages} onClick={handleNextPage}>»</button>
        </div>
      </div>
      
      {/* --- MODALES --- */}
      {/* Modal de edición */}
      <Modal titulo="Editar Producto" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {productoSeleccionado && (
          <FormEditaProducto
            productoToEditar={productoSeleccionado}
            onClose={() => setIsEditModalOpen(false)}
            onProductoEditado={onActionSuccess}
          />
        )}
      </Modal>

      {/* Modal de importación (usando el método recomendado de daisyUI) */}
       {/* Modal de importación (usando el método recomendado de daisyUI) */}
      <dialog id="import_modal" ref={importModalRef} className="modal">
        {/* AÑADE UN ID AQUÍ */}
        <div id="import-modal-container" className="modal-box relative"> 
          <h3 className="font-bold text-lg mb-4">Importar Productos desde Archivo</h3>
          {/* Le pasamos el ID del contenedor como prop a ImportarProductos */}
          <ImportarProductos modalTargetId="import-modal-container" />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cerrar</button>
            </form>
          </div>
        </div>
        {/* Esto es para que al hacer clic fuera, se cierre el modal */}
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ProductosTable;