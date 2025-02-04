import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Inventario from "./components/productos/Inventario";
import NotFound from "./components/pages/NotFound";
import UpdatePrices from "./components/precios/UpdatePrices";
import ProtectedRoute from "./components/security/ProtectedRoute";
import Sales from "./components/ventas/Sales";
import TablaVentas from "./components/ventas/TablaVentas";


const App = () => {
  return (
    <Routes >
      <Route path="/login" element={<LoginForm />} />
      {/* Ruta protegida */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>

      <Route path="/inventario" element={<Inventario />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/precios" element={<UpdatePrices />} />
      </Route>
      {/**Ruta para las facturas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/facturar" element={<Sales />} />
      </Route>
           {/**Ruta para las ventas */}
           <Route element={<ProtectedRoute />}>
        <Route path="/ventas" element={<TablaVentas />} />
      </Route>
      {/* Ruta 404 - Catch-all para rutas no válidas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
