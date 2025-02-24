import React from "react";
import { useState, useEffect } from "react";
import { useGetRequest } from "../../hooks/useGetRequest";
import ModalCheckbox from "../modales/ModalCheckbox";
import DataCard from "../cards/DataCard";

const Audit = () => {
  const { callApiGet, loading, error, response } = useGetRequest();
  const [auditLogs, setAuditLogs] = useState([]);
  const [isModalDetallesOpen, setIsModalDetallesOpen] = useState(false);
  const [datosDetallesAntes, setDatosDetallesAntes] = useState(null);
  const [datosDetallesDespues, setDatosDetallesDespues] = useState(null);
  //controlles para paginación
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(20); // Productos por página



  useEffect(() => {
    const getAudit = async (page, limit, searchTerm, token) => {
      try {
        const data = await callApiGet("/audit");
        console.log("Respuesta de la API de Auditoría:", data);
        
        setAuditLogs(data.logsAudit || []);
      } catch (apiError) {
        console.error("Error al obtener la auditoría:", apiError);
      }
    };
    getAudit();
  }, [page,limit]);

  const handleVerDetalles = (log) => {
    try {
      const datosAntesParsed = JSON.parse(log.datos_antes);
      const datosDespuesParsed = JSON.parse(log.datos_despues);
      setDatosDetallesAntes(datosAntesParsed);
      setDatosDetallesDespues(datosDespuesParsed);
    } catch (error) {
      console.error("Error al parsear JSON en handleVerDetalles:", error);
      setDatosDetallesAntes({ error: "Error al mostrar los datos" });
      setDatosDetallesDespues({ error: "Error al mostrar los datos" });
    }
    setIsModalDetallesOpen(true);
  };

  const handleCloseModalDetalles = () => {
    setIsModalDetallesOpen(false);
  };

  if (loading) {
    return <div>Cargando auditoría...</div>;
  }

  if (error) {
    return <div>Error al cargar la auditoría: {error}</div>;
  }



  // Cambiar a la página anterior
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Cambiar a la página siguiente
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Historico de cambios (Auditoria) a la tabla productos
      </h2>

      {auditLogs.length > 0 ? (
        <table className="table table-xs">
          <thead>
            <tr>
              <th>ID</th>
              <th>Codigo del producto</th>
              <th>Usuario que realizo la accion</th>
              <th>Tipo de operacion</th>
              <th>Fecha y Hora</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td className="text-right">{log.producto_id}</td>
                <td className="text-center">{log.usuario_id}</td>
                <td>{log.tipo_operacion}</td>
                <td>{log.fecha_hora}</td>
                <td>
                  {/*  ✅  Botón "Ver Detalles" */}
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => handleVerDetalles(log)}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No hay registros de auditoría para mostrar.</div>
      )}

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

      {/* ✅  Un solo ModalCheckbox para "Ver Detalles" */}
      <ModalCheckbox
        isOpen={isModalDetallesOpen}
        onClose={handleCloseModalDetalles}
        title="Detalles de Auditoría"
        modalId="modal-detalles-auditoria" // ID único para el modal de detalles
      >
        {/* Contenido del modal de "Ver Detalles" */}
        <div className="grid grid-cols-2 gap-4">
 
          <div>
            <h4 className="font-bold mb-2">Datos Anteriores</h4>
            <DataCard data={datosDetallesAntes} />
            {/* DataCard para "Datos Antes" */}
          </div>
          <div>
            <h4 className="font-bold mb-2">Datos Posteriores</h4>
            <DataCard data={datosDetallesDespues} />
            {/* DataCard para "Datos Despues" */}
          </div>
        </div>
      </ModalCheckbox>
    </div>
  );
};

export default Audit;
