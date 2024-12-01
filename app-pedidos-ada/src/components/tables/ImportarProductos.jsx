/// Este componente permite importar productos desde un fichero csv a la base de datos
import React, { useState } from "react";
import Papa from "papaparse";
import Swal from "sweetalert2";

const ImportarProductos = () => {
  const [productos, setProductos] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true, // Lee los encabezados automáticamente
      skipEmptyLines: true, // Ignora líneas en blanco
      complete: (result) => {
        try {
          // Ajustamos los datos procesados
          const data = result.data.map((producto) => {
            const nombre = producto["Producto"]?.trim() || "";
            const descripcion = producto["Descripción"]?.trim() || "";
            const precioTexto = producto["Precio unitario"]?.trim();

            // Si no hay precio, usar 0
            const precio = precioTexto
              ? parseFloat(precioTexto.replace("$", ""))
              : 0;

            return { nombre, descripcion, precio };
          });

          // Verificamos si todo fue procesado correctamente
          console.log("Datos procesados correctamente:", data);
          setProductos(data);
        } catch (error) {
          console.error("Error procesando el archivo CSV:", error);
        }
      },
      error: (error) => {
        console.error("Error leyendo el archivo CSV:", error);
      },
    });
    console.log(productos);
  };

  /// funcion para inviar la lista de productos

  const enviarProductos = async () => {
    if (productos.length === 0) {
      console.error("No hay productos para enviar");
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    try {
      // Mostrar spinner
      Swal.fire({
        title: "Enviando productos...",
        text: "Por favor, espera.",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(`${apiUrl}/productos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(productos),
      });

      if (!response.ok) {
        throw new Error("El servidor no ha respondido con un codigo 200!");
      }

      const resultado = await response.json();

      console.log("Productos enviados correctamente:", resultado);

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Productos cargados.",
      });
    } catch (error) {
      console.error("Error enviando los productos:", error);

      // Mostrar mensaje de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al cargar los productos.",
      });
    }
  };

  return (
    <>
      <label className="form-control w-full max-w-sm relative">
        <input
          type="file"
          accept=".csv"
          className="file-input max-w-36"
          onChange={handleFileChange}
        />
      </label>

      {productos.length > 0 && (
        <>
          <div className="divider">Se han detectado todos estos productos</div>
          <button className="btn" onClick={enviarProductos}>
            Confirmar productos
          </button>
        </>
      )}
      <ul className="">
        {productos.map((producto, index) => (
          <li key={index}>
            {producto.nombre} - {producto.descripcion} - ${producto.precio}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ImportarProductos;
