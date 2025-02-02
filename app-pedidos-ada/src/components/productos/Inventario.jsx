import React from "react";
import ProductosTable from "./ProductoTable";
import Navbar from "../Navbar";
const Inventario = () => {
  return (
    <div>
        {/* Navbar */}
        <Navbar />
      <h1 className="text-2xl font-bold mb-4 text-center">Inventario de productos</h1>
      <ProductosTable />
    </div>
  );
};

export default Inventario;