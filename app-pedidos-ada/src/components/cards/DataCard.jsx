import React from "react";

const DataCard = ({ data }) => {
  if (!data || typeof data !== 'object') {
    return <div>No hay datos para mostrar.</div>; // Manejar si no hay datos o no es un objeto
  }

  return (
    <div className="card bg-base-100 shadow-xl"> {/* Estilo de "card" con DaisyUI */}
      <div className="card-body">
        <ul className="list-none"> {/* Lista no ordenada para los pares clave-valor */}
          {Object.entries(data).map(([key, value]) => (
            <li key={key} className="mb-2"> {/* Espacio entre cada elemento de la lista */}
              <span className="font-bold capitalize">{key.replace(/_/g, ' ')}:</span> {/* Clave en negrita y capitalizada */}
              <span className="ml-2">{value === null ? 'N/A' : String(value)}</span> {/* Valor, mostrar 'N/A' si es null */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataCard;