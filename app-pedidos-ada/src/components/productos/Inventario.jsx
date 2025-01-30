import React from "react";
import ProductosTable from "./ProductoTable";
import Navbar from "../Navbar";
const Inventario = () => {
  return (
    <div>
        {/* Navbar */}
        <Navbar />
      <h1>Inventario</h1>
      <ProductosTable />
    </div>
  );
};

export default Inventario;