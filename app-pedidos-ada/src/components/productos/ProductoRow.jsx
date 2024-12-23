import DropdownActions from "../menus/DropdownActions";

const ProductoRow = ({ producto, onEditar, onEliminar }) => {
  return (
    <tr>
      <td>{producto.id}</td>
      <td>{producto.nombre}</td>
      <td>{producto.descripcion}</td>
      <td>{producto.codigo_barra}</td>
      <td>{producto.precio}</td>
      <td>{producto.stock}</td>
      <td>
        <DropdownActions
          id={producto.id}
          opciones={[
            { texto: "Editar", accion: () => onEditar(producto) },
            { texto: "Eliminar", accion: () => onEliminar(producto.id) },
          ]}
        />
      </td>
    </tr>
  );
};

export default ProductoRow;
