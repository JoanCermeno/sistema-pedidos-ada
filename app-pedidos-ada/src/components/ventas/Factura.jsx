import React, { useState, useEffect } from "react";
import { usePostRequest } from "../../hooks/usePostRequest";
import { dateToDdMmYyyy } from "../../utils/dateUtil";
import Swal from "sweetalert2";
import ModalCheckbox from "../modales/ModalCheckbox";
import BuscadorCedulaDinamico from "./BuscadorCedulaDinamico";

const Factura = ({ productoToAdd }) => {
  const dolarToday = localStorage.getItem("dolar");

  const { callApi, loading, response, error } = usePostRequest(); //solo para el envio de datos
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); //  <-- ¡NUEVO ESTADO!
  const tiposPrecioFacturaOpciones = [
    // <-- ¡NUEVO: Definir el array de opciones como una constante FUERA del estado!
    "precio_minorista",
    "precio_mayorista",
    "precio_libre",
  ];
  const [tipoPrecioSeleccionadoFactura, setTipoPrecioSelecionadoFactura] =
    useState("precio_minorista"); // <-- ¡ESTADO para guardar el TIPO DE PRECIO SELECCIONADO! - Inicializar con "precio_minorista" por defecto
  const [total, setTotal] = useState(0); // <-- ¡NUEVO ESTADO LOCAL!
  const [productosFactura, setProductosFactura] = useState([]); // <-- ¡NUEVO ESTADO LOCAL!
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- para EL MODAL!
  const [esFacturaCredito, setEsFacturaCredito] = useState(false); // <-- ¡NUEVO ESTADO PARA EL CHECKBOX!

  useEffect(() => {
    if (productoToAdd) {
      console.warn("Producto recibido en Factura:", productoToAdd);
      setProductosFactura((prevState) => {
        const productoExistente = prevState.find(
          (p) => p.id === productoToAdd.id
        );
        if (productoExistente) {
          console.warn(
            "Producto ya existe en la factura:",
            productoToAdd.nombre
          );
          Swal.fire({
            // <-- ¡USA Swal.fire CON CONFIGURACIÓN DE TOAST!
            toast: true, // <-- ¡CONFIGURA COMO TOAST!
            position: "top-end", // <-- ¡POSICIÓN: esquina superior derecha!
            timer: 3000, // <-- ¡CIERRE AUTOMÁTICO después de 3 segundos!
            showConfirmButton: false, // <-- ¡OCULTA el botón de confirmación!
            timerProgressBar: false, // <-- ¡OCULTA la barra de progreso (opcional)!
            icon: "warning", // <-- ¡ÍCONO de advertencia!
            title: `${productoToAdd.nombre} ya existe en la lista`, // <-- ¡MENSAJE!
          });
          return prevState;
        } else {
          console.log("Producto no existe en la lista");
          const productoParaFactura = {
            ...productoToAdd,
            cantidad: 1,
            tipoPrecioFactura: tipoPrecioSeleccionadoFactura,
            subtotal: productoToAdd[tipoPrecioSeleccionadoFactura] * 1,
            subTotalBs:
              productoToAdd[tipoPrecioSeleccionadoFactura] * 1 * dolarToday, // Recalcular subtotal en Bs.
          };
          return [...prevState, productoParaFactura];
        }
      });
    }
  }, [productoToAdd, tipoPrecioSeleccionadoFactura]);

  useEffect(() => {
    recalcularTotalFactura();
  }, [productosFactura]);

  // Cuando cambie el tipo de precio, recalcular subtotal y subtotal en Bs.
  useEffect(() => {
    if (tipoPrecioSeleccionadoFactura) {
      console.log(
        "Tipo de precio seleccionado cambió a:",
        tipoPrecioSeleccionadoFactura
      );
      setProductosFactura((prevState) => {
        return prevState.map((producto) => {
          return {
            ...producto,
            tipoPrecioFactura: tipoPrecioSeleccionadoFactura, // Actualizar el tipo de precio en cada producto
            subtotal:
              producto.cantidad * producto[tipoPrecioSeleccionadoFactura], // Recalcular subtotal
            subTotalBs:
              producto.cantidad *
              producto[tipoPrecioSeleccionadoFactura] *
              dolarToday, // Recalcular subtotal en Bs.
          };
        });
      });
    }
  }, [tipoPrecioSeleccionadoFactura, dolarToday]); // Depende de tipoPrecioSeleccionadoFactura y dolarToday

  //est afuncion es una funcion que permite recibir el cliente desde el componente hijo
  // Y actualiza apartir del componnte hijo al estado del componente padre
  const handeleClienteSeleccionado = (cliente) => {
    setClienteSeleccionado(cliente);
    console.log("Cliente seleccionado:", cliente);
  };

  const handleTipoPrecioChange = (event) => {
    setTipoPrecioSelecionadoFactura(event.target.value); // <-- ¡USAR setTipoPrecioSelecionadoFactura CORRECTAMENTE!
  };

  const handleCantidad = (e, id) => {
    const nuevaCantidad = parseFloat(e.target.value); // Convertir a número decimal

    if (isNaN(nuevaCantidad)) {
      // No es un número válido
      Swal.fire("Error", "Por favor, ingrese una cantidad válida", "error");
      return; // No hacer nada si no es un número válido
    }

    if (nuevaCantidad < 0) {
      // Cantidad negativa (no permitir, o permitir 0 si es lógico para tu negocio)
      Swal.fire("Error", "La cantidad no puede ser negativa", "error");
      return;
    }

    if (nuevaCantidad > 999999) {
      // Un límite máximo arbitrario para evitar cantidades excesivamente grandes
      Swal.fire("Error", "Cantidad demasiado grande", "error");
      return;
    }

    setProductosFactura((prevState) => {
      return prevState.map((item) => {
        if (item.id === id) {
          let cantidadAjustada = nuevaCantidad;

          if (cantidadAjustada > item.stock) {
            cantidadAjustada = item.stock; // Limitar a stock máximo
            Swal.fire(
              "Advertencia",
              `Cantidad ajustada al stock máximo (${item.stock})`,
              "warning"
            );
          }
          if (cantidadAjustada < 0.1 && cantidadAjustada !== 0) {
            // Permitir 0, pero no valores menores a 0.1 (excepto 0)
            cantidadAjustada = 0.1; // Mínimo 0.1
            Swal.fire(
              "Advertencia",
              `Cantidad ajustada al mínimo (0.1)`,
              "warning"
            );
          }

          return {
            ...item,
            cantidad: cantidadAjustada,
            subtotal: cantidadAjustada * item[tipoPrecioSeleccionadoFactura], // Recalcular subtotal
            subTotalBs:
              cantidadAjustada *
              item[tipoPrecioSeleccionadoFactura] *
              dolarToday, // Recalcular subtotal en Bs.
          };
        }
        return item;
      });
    });
    recalcularTotalFactura(); // Recalcular el total de la factura después de cambiar la cantidad
  };

  const handleIncrementar = (id) => {
    setProductosFactura((prevState) => {
      return prevState.map((item) => {
        if (item.id === id) {
          let nuevaCantidad = item.cantidad + 1;

          if (nuevaCantidad > item.stock) {
            nuevaCantidad = item.stock; // Limitar a stock máximo
            Swal.fire(
              "Advertencia",
              `Cantidad ajustada al stock máximo (${item.stock})`,
              "warning"
            );
          }

          return {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item[tipoPrecioSeleccionadoFactura], // Recalcular subtotal
            subTotalBs:
              nuevaCantidad * item[tipoPrecioSeleccionadoFactura] * dolarToday, // Recalcular subtotal en Bs.
          };
        }
        return item;
      });
    });
    recalcularTotalFactura(); // Recalcular el total de la factura después de incrementar la cantidad
  };

  const handleDecrementar = (id) => {
    setProductosFactura((prevState) => {
      return prevState.map((item) => {
        if (item.id === id) {
          let nuevaCantidad = item.cantidad - 1;

          if (nuevaCantidad < 0.1 && nuevaCantidad !== 0) {
            // Permitir 0, pero no valores menores a 0.1 (excepto 0)
            nuevaCantidad = 0.1; // Mínimo 0.1
            Swal.fire(
              "Advertencia",
              `Cantidad ajustada al mínimo (0.1)`,
              "warning"
            );
          }
          if (nuevaCantidad < 0) {
            nuevaCantidad = 0; // Mínimo 0
          }

          return {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item[tipoPrecioSeleccionadoFactura], // Recalcular subtotal
          };
        }
        return item;
      });
    });
    recalcularTotalFactura(); // Recalcular el total de la factura después de decrementar la cantidad
  };

  const recalcularTotalFactura = () => {
    setTotal(
      productosFactura.reduce(
        (acumulador, producto) => acumulador + producto.subtotal,
        0
      )
    );
  };

  const quitarProducto = (id) => {
    setProductosFactura((prevState) => {
      return prevState.filter((producto) => producto.id !== id);
    });
    recalcularTotalFactura();
  };
  const handleLimpiar = () => {
    return;
  };
  const handleGuardar = () => {
    // <-- ¡MODIFICAMOS handleGuardar!
    setIsModalOpen(true); // <-- ¡AHORA SOLO ABRE EL MODAL!
    console.log("Modal de confirmación abierto"); // Opcional: Para verificar que se abre el modal
  };

  const handleConfirmarGuardarFactura = async () => {
    console.log("Usuario confirmó guardar la factura (Débito)"); // <-- ¡INDICAMOS QUE ES DÉBITO!
    //ocultar el modal de confirmación
    setIsModalOpen(false);
    const facturaParaGuardar = {
      nombre_cliente: clienteSeleccionado
        ? clienteSeleccionado.nombre
        : "Cliente Contado Ejemplo", // Usar nombre del cliente o "Cliente Contado Ejemplo" por defecto
      observaciones: "Venta de contado", // Observaciones por defecto para DÉBITO
      metodo_pago: "Efectivo", // Método de pago por defecto para DÉBITO (puedes ajustarlo si tienes más opciones de pago al contado)
      total_factura: total, // El total de la factura (ya lo tienes en el estado 'total')
      detalles_factura: productosFactura.map((producto) => ({
        // Mapear productosFactura al formato de 'detalles_factura'
        producto_id: producto.id,
        cantidad: producto.cantidad,
        precio_unitario: producto[tipoPrecioSeleccionadoFactura], // Usar el tipo de precio seleccionado para el precio unitario
        subtotal: producto.subtotal, // Subtotal por producto (ya lo tienes calculado en 'producto.subtotal')
      })),
    };

    console.log(
      "Datos de factura a enviar a la API (DÉBITO):",
      facturaParaGuardar
    ); // <-- ¡INDICAMOS QUE ES DÉBITO en el log!
    callApi("/facturas/debito", facturaParaGuardar);
  };

  useEffect(() => {
    // <-- ¡NUEVO useEffect PARA MANEJAR LA RESPUESTA DE LA API!
    if (response) {
      // Si hay una respuesta EXITOSA de la API (response no es null)
      console.log("Respuesta exitosa de la API:", response);

      Swal.fire({
        title: "¡Éxito!",
        text: `Venta guardada con éxito`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      // 🌈🌈🌈 ¡¡¡AQUÍ PUEDES AÑADIR ACCIONES ADICIONALES DESPUÉS DE GUARDAR LA FACTURA CON ÉXITO!!! 🌈🌈🌈
      // Ejemplos:
      // - Limpiar la factura (vaciar productosFactura, resetear total, etc.)
      // - Redirigir a la pantalla de "Ver Facturas"
      // - Imprimir la factura automáticamente
      setProductosFactura([]); // Limpia la lista de productos de la factura
      setTotal(0); // Resetea el total a 0
    }

    if (error) {
      // Si hubo un ERROR al llamar a la API (error no es null)
      console.error("Error al guardar la factura:", error);
      Swal.error("Error al guardar la factura. Inténtalo de nuevo.", {
        // Muestra un toast de ERROR
        position: "top-right",
        autoClose: 5000, // Duración un poco más larga para los errores
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // 💔💔💔 ¡¡¡AQUÍ PUEDES AÑADIR LÓGICA ADICIONAL PARA MANEJAR EL ERROR!!! 💔💔💔
      // Ejemplos:
      // - Mostrar un mensaje de error más detallado al usuario
      // - Registrar el error en un sistema de logs
    }
  }, [response, error]); // ¡¡¡DEPENDENCIAS: response y error para que se ejecute cuando cambien!!!
  return (
    <>
      <div className="flex w-full  flex-col gap-2 justify-start items-start p-10  relative">
        <header className="flex flex-col items-end justify-end w-full  px-5 rounded">
          <section className="flex flex-row gap-2 items-center justify-end w-full">
            <small className="text-gray-500">Tipo de precio:</small>

            <div>
              <select
                className="select select-bordered select-sm w-full max-w-xs"
                value={tipoPrecioSeleccionadoFactura} // <-- ¡Value CORRECTO - Ahora es el VALOR SELECCIONADO!
                onChange={handleTipoPrecioChange} // <-- ¡Añadir el onChange!
              >
                <option disabled>Precio</option>
                {tiposPrecioFacturaOpciones.map(
                  (
                    tipo // <-- ¡Mapeando el ARRAY DE OPCIONES (CORRECTO)!
                  ) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  )
                )}
              </select>
            </div>
            {clienteSeleccionado &&
              clienteSeleccionado.nombre && ( //  <-- ¡Añadimos el elemento small aquí!
                <p className="text-sm">
                  Cliente:
                  <span className="font-semibold">
                    {clienteSeleccionado.nombre}
                  </span>
                </p>
              )}
            <BuscadorCedulaDinamico
              onClienteSeleccionado={handeleClienteSeleccionado}
            />
          </section>
        </header>

        <div className="overflow-x-auto w-full  rounded-lg shadow-md">
          {productosFactura.length > 0 ? (
            <table className="table bg-base-100">
              <thead className="bg-base-100">
                <tr>
                  <th>Quitar</th>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {productosFactura.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <button
                        className="btn btn-outline btn-error btn-sm"
                        onClick={() => quitarProducto(item.id)} // Llamar a la función eliminarProducto
                      >
                        X
                      </button>
                    </td>
                    <td>
                      {item.nombre}
                      <small className="text-sm text-gray-500">
                        <br />
                        {item.descripcion}
                      </small>
                    </td>
                    <td>
                      ${item[tipoPrecioSeleccionadoFactura].toFixed(2)}
                      <br />
                      <small>
                        {item[tipoPrecioSeleccionadoFactura].toFixed(2) *
                          dolarToday}
                      </small>
                    </td>
                    {/* <-- ¡PRECIO UNITARIO DINÁMICO! */}
                    <td className="flex">
                      <div className="join w-full">
                        <button
                          className="btn btn-outline btn-sm join-item btn-error"
                          onClick={() => handleDecrementar(item.id)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="input input-bordered input-sm join-item max-w-20"
                          value={item.cantidad.toFixed(2)}
                          min="0" // o "0.1" si no permites cantidad 0
                          max={item.stock}
                          step="0.01" // <-- ¡AÑADIR step="0.1" PARA DECIMALES!
                          onChange={(e) => handleCantidad(e, item.id)}
                        />
                        <button
                          className="btn btn-outline btn-sm join-item btn-success"
                          onClick={() => handleIncrementar(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      ${item.subtotal.toFixed(2)}
                      <small className="text-sm text-gray-500">
                        <br />
                        {(item.subtotal * dolarToday).toFixed(2)}
                        Bs.
                      </small>
                    </td>
                  </tr>
                ))}

                {/* Fila del total */}
                <tr className="bg-base-200">
                  <th colSpan="4" className="text-right">
                    <h1 className="text-2xl font-bold mb-4 text-right">
                      Total
                    </h1>
                  </th>
                  <td className="font-bold">
                    ${total.toFixed(2)}
                    <small className="text-sm text-gray-500">
                      <br />
                      Bs. {(total * dolarToday).toFixed(2)}
                    </small>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <small className="text-center">
                Seleccione un producto para agregar a la factura
              </small>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-end w-full gap-5 flex-wrap">
          <label className="label cursor-pointer">
            <span className="label-text">Factura a Crédito?</span>
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={esFacturaCredito} // <-- ¡Conectado al estado esFacturaCredito!
              onChange={(e) => setEsFacturaCredito(e.target.checked)} // <-- ¡Actualiza el estado al cambiar!
            />
          </label>

          <button className="btn btn-md" onClick={handleLimpiar}>
            Limpiar factura
          </button>
          <button
            className={`btn btn-primary btn-md font-bold `}
            onClick={handleGuardar}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <span>Facturar a debito</span>
            )}
          </button>

          {/*  ¡¡¡MODAL DE CONFIRMACIÓN!!! */}
          <ModalCheckbox
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Confirmar Factura?"
            modalId="confirmar-factura-modal"
          >
            <div className="mt-4 space-y-2 ">
              <p>
                <span className="font-semibold">Nombre del cliente:</span>
                {clienteSeleccionado
                  ? clienteSeleccionado.nombre
                  : "Cliente Contado"}
              </p>
              <p>
                <span className="font-semibold">Cédula:</span>
                {clienteSeleccionado
                  ? clienteSeleccionado.cedula
                  : "Cliente Contado"}
              </p>
              {/* Añadido para mostrar la cédula */}
              <p>
                <span className="font-semibold">Tipo de Precio:</span>
                {tipoPrecioSeleccionadoFactura}
              </p>
              {/* Añadido para mostrar el tipo de precio */}
              <p>
                <span className="font-semibold">Fecha:</span>
                {dateToDdMmYyyy(new Date())}
              </p>
              {/* Añadido para mostrar la fecha */}
            </div>

            {/* Tabla de productos */}
            <div className="overflow-x-auto mt-4">
              <table className="table table-xs">
                <thead className="bg-base-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Producto</th>
                    <th className="py-2 px-4 text-center">Cantidad</th>
                    <th className="py-2 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFactura.map((item, index) => (
                    <tr key={index} className="">
                      <td className="py-2 px-4">{item.nombre}</td>
                      <td className="py-2 px-4 text-center">
                        {item.cantidad.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-right">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Factura */}
            <div className="mt-4 flex justify-end text-lg font-semibold p-2 gap-2">
              <span className="font-semibold uppercase">Total Factura:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Botones de Acción */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="btn btn-neutral"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmarGuardarFactura}
              >
                {/* ¡Mantenemos onClick para "Confirmar"! */}
                Confirmar y Guardar Factura
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleConfirmarGuardarFactura}
              >
                {/* ¡Añadido onClick para "Imprimir"! */}
                Imprimir
              </button>
            </div>
          </ModalCheckbox>
        </div>
      </div>
    </>
  );
};

export default Factura;
