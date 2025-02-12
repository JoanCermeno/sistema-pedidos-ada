import { convertirHora24a12 } from "../../utils/dateUtil";
import { yyyyMmDdToDdMmYyyy } from "../../utils/dateUtil";

const FacturaImprimible = ({ venta }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nota de entrega</h1>
      <div className="mb-4">
        <p>
          <strong>ID:</strong> {venta.id}
        </p>
        <p>
          <strong>Cliente:</strong> {venta.nombre_cliente}
        </p>
        <p>
          <strong>Cédula:</strong> {venta.cedula}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {yyyyMmDdToDdMmYyyy(venta.fecha.split(" ")[0])}
        </p>
        <p>
          <strong>Hora:</strong> {convertirHora24a12(venta.fecha.split(" ")[1])}
        </p>
      </div>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio ($)</th>
            <th>Precio (Bs)</th>
            <th>Subtotal ($)</th>
          </tr>
        </thead>
        <tbody>
          {venta.detalles.map((detalle) => (
            <tr key={detalle.id}>
              <td>{detalle.producto_nombre}</td>
              <td>{detalle.cantidad}</td>
              <td>${detalle.precio.toFixed(2)}</td>
              <td>{detalle.precio_bs.toFixed(2)} Bs</td>
              <td>${detalle.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p>
          <strong>Total ($):</strong> ${venta.total.toFixed(2)}
        </p>
        <p>
          <strong>Total (Bs):</strong> {venta.total_bs.toFixed(2)} Bs
        </p>
      </div>
    </div>
  );
};

export default FacturaImprimible;
