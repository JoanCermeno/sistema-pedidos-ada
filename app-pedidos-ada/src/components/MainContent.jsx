import React from "react";
import { useNavigate } from "react-router-dom";

const MainContent = () => {
    const navigate = useNavigate();

    // Array de datos para las funciones principales
    const funcionesPrincipales = [
        {
            titulo: "Inventario.",
            descripcion: "Lista de productos, con sus cantidades y precios.",
            ruta: "/inventario",
          
        },
        {
            titulo: "Actualizador de precios",
            descripcion: "Que la inflación no te haga perder más dinero actualiza el precio del dólar hoy.",
            ruta: "/precios",
        
        },
        {
            titulo: "Ventas",
            descripcion: "Resumen de las ventas realizadas por los vendedores.",
            ruta: "/ventas",
   
        },
        {
            titulo: "Facturar",
            descripcion: "Realizar una venta de productos.",
            ruta: "/facturar",
      
        },
    ];

    return (
        <div className="flex-1 p-6">
            <h1 className="text-4xl font-bold mx-4 mb-5">Funciones principales</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
                {funcionesPrincipales.map((funcion, index) => (
                    <div
                        key={index}
                        className={`card shadow-lg hover:cursor-pointer hover:shadow-2xl hover:scale-105 transition ease-out border-l-5 border-indigo-500 bg-indigo-50`}
                        onClick={() => navigate(funcion.ruta)}
                    >
                        <div className="card-body ">
                            <h2 className={`card-title font-bold `}>{funcion.titulo}</h2>
                            <p>{funcion.descripcion}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainContent;