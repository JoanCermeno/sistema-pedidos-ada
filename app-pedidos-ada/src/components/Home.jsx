import React, { useState } from "react";
import BarcodeScanner from "./BarcodeScanner"; // Asegúrate de importar tu componente

const Home = () => {
  const [scannerActive, setScannerActive] = useState(false);

  const toggleScanner = () => {
    setScannerActive(!scannerActive);
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Buscar productos</h1>
      <BarcodeScanner />
    </div>
  );
};

export default Home;
