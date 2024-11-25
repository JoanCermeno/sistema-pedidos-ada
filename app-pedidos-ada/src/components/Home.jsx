const home = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="card bg-primary text-primary-content shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Clientes</h2>
          <p>Total: 120</p>
        </div>
      </div>
      <div className="card bg-accent text-accent-content shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Productos</h2>
          <p>Total: 56</p>
        </div>
      </div>
      <div className="card bg-secondary text-secondary-content shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Pedidos</h2>
          <p>Total: 34</p>
        </div>
      </div>
    </div>
  );
};
export default home;
