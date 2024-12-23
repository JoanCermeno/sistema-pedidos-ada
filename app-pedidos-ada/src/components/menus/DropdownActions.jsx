import React from "react";
///esto recibe un id del elemento de una talba mas las opciones
const DropdownActions = ({ id, opciones }) => {
  return (
    <div className="dropdown">
      {/* Clase 'btn-sm' para reducir el tamaño y 'btn-ghost' para un estilo más limpio */}
      <div tabIndex={0} role="button" className="btn btn-sm btn-ghost m-1">
        •••
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {opciones.map((opcion, index) => (
          <li key={index}>
            <button
              className="w-full text-left"
              onClick={() => opcion.accion(id)}
            >
              {opcion.texto}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownActions;
