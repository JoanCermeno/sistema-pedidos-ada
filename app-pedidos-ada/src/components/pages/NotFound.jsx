import React from "react";


const NotFound = () => {




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
        <a
          href="/"
          className="btn btn-primary mt-5"
        >
          Volver a la página de inicio
        </a>
      </div>
    </>
  );
};

export default NotFound;
