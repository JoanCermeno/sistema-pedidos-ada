import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Inventario from "./components/productos/Inventario";
import NotFound from "./components/pages/NotFound";
import ProtectedRoute from "./components/security/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
         {/* Ruta protegida */}
         <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

      <Route path="/inventario" element={<Inventario />} />
      <Route path="/precios" element={<Inventario />} />
       {/* Ruta 404 - Catch-all para rutas no válidas */}
       <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
