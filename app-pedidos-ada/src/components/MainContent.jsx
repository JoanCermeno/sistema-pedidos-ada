import React from "react";
import { Routes, Route ,useNavigate} from "react-router-dom";



const MainContent = () => {

  const navigate = useNavigate();



  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold mx-4 mb-5 ">Funciones principales</h1> 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
        <div className="card shadow-lg   hover:cursor-pointer hover:shadow-2xl  hover:scale-105 transition ease-out">
          <div className="card-body " onClick={ () => navigate("/inventario")}>
            <h2 className="card-title  font-bold ">Inventario.</h2>
            <p>Lista de productos, con sus canidades y precios.</p>
          </div>
        </div>
        <div className="card shadow-lg hover:cursor-pointer hover:shadow-2xl  hover:scale-105 transition ease-out" onClick={ () => navigate("/precios")}>
          <div className="card-body">
            <h2 className="card-title  font-bold">Actualizador de precios</h2>
            <p>Que la inflacion no te haga perder mas dienero
              actualiza el precio del dolar hoy.
            </p>
          </div>
        </div>
        <div className="card shadow-lg  text-accent-content hover:cursor-pointer hover:shadow-2xl hover:scale-105 transition ease-out" onClick={ () => navigate("/ventas")}>
          <div className="card-body ">
            <h2 className="card-title  font-bold">Ventas</h2>
            <p className="">Resumen de las ventas realizadas por los vendedores.</p>
          </div>
        </div>

        <div className="card shadow-lg  text-accent-content hover:cursor-pointer hover:shadow-2xl hover:scale-105 transition ease-out" onClick={ () => navigate("/facturar")}>
          <div className="card-body ">
            <h2 className="card-title  font-bold">Facturar</h2>
            <p className="">Realizar una venta de productos.</p> 
          </div>
        </div>


        <div className="card shadow-lg  text-accent-content hover:cursor-pointer hover:shadow-2xl hover:scale-105 transition ease-out" onClick={ () => navigate("/facturar")}>
          <div className="card-body ">
            <h2 className="card-title  font-bold">Pendientes por cobrar</h2>
            <p className="">Ver los clientes que estan pendiente por pagos.</p> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
