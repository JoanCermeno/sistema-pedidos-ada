import React from "react";
import { Routes, Route ,useNavigate} from "react-router-dom";



const MainContent = () => {

  const navigate = useNavigate();

const handleInventoryClick = () => {
  navigate("/inventario");
};
const handleActualizadorClick = () => {
  navigate("/precios"); 
  
};


  return (
    <div className="flex-1 p-6 bg-base-100">
      <h1 className="text-2xl font-bold mb-4">Funciones principales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card shadow-lg bg-primary text-primary-content">
          <div className="card-body" onClick={handleInventoryClick}>
            <h2 className="card-title">Inventario.</h2>
            <p>Lista de productos, con sus canidades y precios.</p>
          </div>
        </div>
        <div className="card shadow-lg bg-secondary text-secondary-content" onClick={handleActualizadorClick}>
          <div className="card-body">
            <h2 className="card-title">Actualizador de precios</h2>
            <p>Que la inflacion no te haga perder mas dienero
              actualiza el precio del dolar hoy.
            </p>
          </div>
        </div>
        <div className="card shadow-lg bg-accent text-accent-content">
          <div className="card-body">
            <h2 className="card-title">Ventas</h2>
            <p>Resumen de las ventas realizadas por los vendedores.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
