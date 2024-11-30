/// Este componente permite importar productos desde un fichero csv a la base de datos
import React, { useState } from "react";
import Papa from "papaparse";

const ImportarProductos = ({ onProductosProcesados }) => {
  const [productos, setProductos] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data.map((producto) => ({
          nombre: producto["Producto"]?.trim() || "",
          descripcion: producto["Descripción"]?.trim() || "",
          precio: parseFloat(producto["Precio unitario"].replace("$", "")) || 0, // Quitar el signo de dólar
        }));

        setProductos(data);
        onProductosProcesados(data); // Pasar los datos al componente padre
      },
      error: (error) => {
        console.error("Error procesando el archivo CSV:", error);
      },
    });
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

      <ul>
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
