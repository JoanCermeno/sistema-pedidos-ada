import React from "react";

const MainContent = () => {
  return (
    <div className="flex-1 p-6 bg-base-100">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card shadow-lg bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">Card 1</h2>
            <p>Details about this card.</p>
          </div>
        </div>
        <div className="card shadow-lg bg-secondary text-secondary-content">
          <div className="card-body">
            <h2 className="card-title">Card 2</h2>
            <p>Details about this card.</p>
          </div>
        </div>
        <div className="card shadow-lg bg-accent text-accent-content">
          <div className="card-body">
            <h2 className="card-title">Card 3</h2>
            <p>Details about this card.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
