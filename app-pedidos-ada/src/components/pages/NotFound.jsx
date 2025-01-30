import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/dasboard");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-base-100">
        <h1 className="text-4xl font-bold text-error">
          404 - Página no encontrada
        </h1>
        <p className="text-lg mt-4 max-w-[80%]">
          Lo sentimos, Ocurrio un error esta pagina no existe. verifique la ruta
          que estás buscando. o la opcion que quieres aceder
        </p>
        <p className="text-lg">Por favor, intenta ir a una ruta válida</p>
        <a
          href="/dashboard"
          className="btn btn-primary mt-5"
          onClick={handleHomeClick}
        >
          Volver a la página de inicio
        </a>
      </div>
    </>
  );
};

export default NotFound;
