const OverViewProductos = () => {
  const inventarioResumen = [
    {
      title: "Total de Productos",
      value: 150, // Reemplaza con el valor real calculado
    },
    {
      title: "Valor Total del Inventario",
      value: "$12,500", // Reemplaza con el valor real calculado
    },
    {
      title: "Productos con Stock Bajo",
      value: 15, // Reemplaza con el valor real calculado
    },
    // Puedes agregar más tarjetas aquí
  ];

  return (
    <div className="container mx-auto px-5">

      {/* Sección de tarjetas informativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {inventarioResumen.map((item, index) => (
          <div key={index} className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h2 className="card-title font-bold">
                {item.title}
              </h2>
              <p className="text-xl font-semibold text-secondary">{item.value}</p>
              {/* Puedes agregar más información aquí si es necesario */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverViewProductos;
