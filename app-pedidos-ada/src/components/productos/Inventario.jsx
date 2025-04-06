import React from "react";
import ProductosTable from "./ProductoTable";
import OverViewProductos from "./OverViewProductos";

const Inventario = () => {
  return (
    <div className="container mx-auto px-5 ">

      {/* Vista general */}
      <OverViewProductos />

      {/* Tabla de productos */}
        <ProductosTable />
    </div>
  );
};

export default Inventario;