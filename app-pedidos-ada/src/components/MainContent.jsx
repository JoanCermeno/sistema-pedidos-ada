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
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold mx-4 mb-5 text-orange-950">Funciones principales</h1> 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
        <div className="card shadow-lg bg-orange-50 text-primary-content hover:cursor-pointer hover:shadow-2xl  hover:scale-105 transition ease-out">
          <div className="card-body " onClick={handleInventoryClick}>
            <h2 className="card-title text-orange-800 font-bold ">Inventario.</h2>
            <p>Lista de productos, con sus canidades y precios.</p>
          </div>
        </div>
        <div className="card shadow-lg bg-orange-50 text-secondary-content hover:cursor-pointer hover:shadow-2xl  hover:scale-105 transition ease-out" onClick={handleActualizadorClick}>
          <div className="card-body">
            <h2 className="card-title text-orange-800 font-bold">Actualizador de precios</h2>
            <p>Que la inflacion no te haga perder mas dienero
              actualiza el precio del dolar hoy.
            </p>
          </div>
        </div>
        <div className="card shadow-lg bg-orange-50 text-accent-content hover:cursor-pointer hover:shadow-2xl hover:scale-105 transition ease-out">
          <div className="card-body ">
            <h2 className="card-title text-orange-800 font-bold">Ventas</h2>
            <p className="text-orange-950">Resumen de las ventas realizadas por los vendedores.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
