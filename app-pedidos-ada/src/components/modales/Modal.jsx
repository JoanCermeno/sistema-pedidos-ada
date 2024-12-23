const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null; // Si no está abierto, no renderiza nada

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <button
          className="btn btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✖
        </button>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default Modal;
