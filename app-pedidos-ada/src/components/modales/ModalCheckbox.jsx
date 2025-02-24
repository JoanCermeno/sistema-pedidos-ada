import React from "react";

const ModalCheckbox = ({ isOpen, onClose, children, title, modalId }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* El checkbox oculto que controla el estado del modal */}
      <input type="checkbox" id={modalId} className="modal-toggle" checked={isOpen} onChange={onClose} /> {/* Añadimos onChange para manejar el cierre */}
      <div className="modal" role="dialog">
        <div className="relative modal-box w-11/12 max-w-5xl">
          <h3 className="text-lg font-bold mb-4 text-center">{title}</h3>
          {children}
        </div>
        <label className="modal-backdrop" htmlFor={modalId}></label> {/* El backdrop para cerrar al hacer clic fuera */}
      </div>
    </>
  );
};

export default ModalCheckbox;