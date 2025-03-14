import React from "react";
import ProductosTable from "./ProductoTable";
import OverViewProductos from "./OverViewProductos";

const Inventario = () => {
  return (
    <div>

      {/* Vista general */}
      <OverViewProductos />

      {/* Tabla de productos */}
        <ProductosTable />
    </div>
  );
};

export default Inventario;