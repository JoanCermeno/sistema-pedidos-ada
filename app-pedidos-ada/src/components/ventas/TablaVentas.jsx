import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useGetRequest } from "../../hooks/useGetRequest.js";
import { convertirHora24a12, yyyyMmDdToDdMmYyyy } from "../../utils/dateUtil";
import FacturaImprimible from "./FacturaImprimible";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
const TablaVentas = () => {
  const { callApiGet, loading, error, response } = useGetRequest();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [ventas, setVentas] = useState([]);
  const limit = 20; // Productos por página
  // Pedir las ventas a la API
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const data = await callApiGet(
          `/venta?page=${page}&limit=${limit}&search=${searchTerm}`
        );
        console.log(data);
        setVentas(data.ventas);
        setTotalPages(Math.ceil(data.totalVentas / limit));
        setPage(data.paginaActual);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(ventas);

    fetchVentas();
  }, [page, searchTerm]);

  // Estado para manejar qué filas están expandidas
  const [expandedRows, setExpandedRows] = useState([]);

  // Función para expandir/colapsar una fila
  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  // Cambiar a la página anterior
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Cambiar a la página siguiente
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const imprimirFactura = (venta) => {
    const doc = new jsPDF();

    // Encabezado de la factura
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255); // Azul
    doc.text(`Factura #${venta.id}`, 10, 10);

    // Información de la empresa
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro
    doc.text("Nombre de la Empresa", 10, 20);
    doc.text("Dirección: Calle Falsa 123", 10, 25);
    doc.text("Teléfono: +123 456 789", 10, 30);
    doc.text("Email: info@empresa.com", 10, 35);

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(10, 40, 200, 40);

    // Información del cliente
    doc.setFontSize(14);
    doc.text("Información del Cliente", 10, 50);
    doc.setFontSize(12);
    doc.text(`Nombre: ${venta.nombre_cliente}`, 10, 60);
    doc.text(`Cédula: ${venta.cedula}`, 10, 65);
    doc.text(`Fecha: ${yyyyMmDdToDdMmYyyy(venta.fecha.split(" ")[0])}`, 10, 70);
    doc.text(`Hora: ${convertirHora24a12(venta.fecha.split(" ")[1])}`, 10, 75);

    // Línea separadora
    doc.line(10, 80, 200, 80);

    // Detalles de la factura
    doc.setFontSize(14);
    doc.text("Detalles de la Factura", 10, 90);

    // Crear la tabla con autoTable
    const detalles = venta.detalles.map((detalle) => [
      detalle.producto_nombre,
      detalle.cantidad,
      `$${detalle.precio.toFixed(2)}`,
      `$${detalle.subtotal.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 100, // Posición inicial de la tabla
      head: [["Producto", "Cantidad", "Precio ($)", "Subtotal ($)"]], // Encabezados de la tabla
      body: detalles, // Datos de la tabla
      theme: "striped", // Estilo de la tabla (puedes usar "grid", "plain", etc.)
      styles: {
        fontSize: 12, // Tamaño de la fuente
        cellPadding: 3, // Espaciado interno de las celdas
        valign: "middle", // Alineación vertical
        halign: "center", // Alineación horizontal
      },
      headStyles: {
        fillColor: [0, 0, 55], // Color de fondo del encabezado (azul)
        textColor: [255, 255, 255], // Color del texto del encabezado (blanco)
        fontStyle: "bold", // Texto en negrita
      },
      bodyStyles: {
        textColor: [0, 0, 0], // Color del texto del cuerpo (negro)
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Color de fondo para filas alternas (gris claro)
      },
    });

    // Totales
    const finalY = doc.lastAutoTable.finalY; // Obtener la posición final de la tabla
    doc.setFontSize(14);
    doc.text("Totales", 10, finalY + 10);
    doc.text(`Total ($): $${venta.total.toFixed(2)}`, 10, finalY + 20);
    doc.text(`Total (Bs): ${venta.total_bs.toFixed(2)} Bs`, 10, finalY + 25);

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gris
    doc.text("Gracias por su compra.", 10, doc.internal.pageSize.height - 20);
    doc.text(
      "Condiciones: Pago contra entrega.",
      10,
      doc.internal.pageSize.height - 15
    );

    // Abrir el diálogo de impresión
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <>
      {/* Contenido */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Registro de ventas
        </h1>
        <div className="flex flex-row gap-1">
          <label className="input input-sm input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Nombre del cliente"
              onChange={(e) => setSearchTerm(e.target.value)}
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
        </div>

        {loading && (
          <p>
            Cargando ventas...
            <span className="loading loading-spinner loading-sm"></span>
          </p>
        )}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Tabla de ventas */}
        <div className="overflow-x-auto ">
          <table className="table w-full">
            {/* Encabezado de la tabla */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Cédula</th>
                <th>Fecha</th>
                <th>Total ($)</th>
                <th>Total (Bs)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            {/* Cuerpo de la tabla */}
            <tbody>
              {ventas.map((venta) => (
                <React.Fragment key={venta.id}>
                  {/* Fila principal */}
                  <tr
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleRow(venta.id)}
                  >
                    <td>{venta.id}</td>
                    <td>{venta.nombre_cliente}</td>
                    <td>{venta.cedula}</td>
                    <td>
                      {" "}
                      {yyyyMmDdToDdMmYyyy(venta.fecha.split(" ")[0])}
                      <br />
                      <small className="text-sm text-gray-500">
                        {convertirHora24a12(venta.fecha.split(" ")[1])}
                      </small>
                    </td>

                    <td>${venta.total.toFixed(2)}</td>
                    <td>{venta.total_bs.toFixed(2)} Bs</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-sm btn-info cursor-pointer text-white"
                        onClick={() => toggleRow(venta.id)}
                      >
                        {expandedRows.includes(venta.id)
                          ? "Ocultar"
                          : "Ver detalles"}
                      </button>
                      {/**boton para imprimir */}
                      <button
                        className="btn btn-sm btn-accent cursor-pointer text-white"
                        onClick={() => imprimirFactura(venta)}
                      >
                        Imprimir
                      </button>
                    </td>
                  </tr>
                  {/* Fila expandible con detalles */}
                  {expandedRows.includes(venta.id) && (
                    <tr>
                      <td colSpan="7">
                        <div className="p-4 bg-gray-50">
                          <h2 className="font-bold mb-2">
                            Detalles de la venta
                          </h2>
                          <table className="table w-full">
                            <thead>
                              <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio ($)</th>
                                <th>Precio (Bs)</th>
                                <th>Subtotal ($)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {venta.detalles.map((detalle) => (
                                <tr key={detalle.id}>
                                  <td>
                                    {detalle.producto_nombre}
                                    <small className="text-sm text-gray-500">
                                      <br />
                                      {detalle.producto_descripcion}
                                    </small>
                                  </td>
                                  <td>{detalle.cantidad}</td>
                                  <td>${detalle.precio.toFixed(2)}</td>
                                  <td>{detalle.precio_bs.toFixed(2)} Bs</td>
                                  <td>${detalle.subtotal.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
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
      </div>
    </>
  );
};

export default TablaVentas;
