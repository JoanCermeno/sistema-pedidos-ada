import React, { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const BarcodeScanner = ({ onCodigoEscaneado }) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  const startScanner = () => {
    // Inicializar el escáner al dar clic en "Abrir Cámara"
    setIsScanning(true);

    const scannerContainer = document.querySelector("#reader");

    if (!scannerContainer) {
      console.error("El contenedor del escáner no existe.");
      return;
    }

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("Código escaneado:", decodedText);
        onCodigoEscaneado(decodedText);
        stopScanner(scanner);
      },
      (error) => {
        console.warn("Error escaneando:", error);
      }
    );

    scannerRef.current = scanner;
  };

  const stopScanner = (scanner) => {
    if (scanner) {
      scanner.clear();
    }
    setIsScanning(false);
  };

  return (
    <div className="">
      <button
        onClick={startScanner}
        className={`btn btn-sm  ${isScanning ? "btn-disabled" : "btn-neutral"}`}
        disabled={isScanning}
      >
        Escaner
      </button>

      {/* Contenedor siempre presente */}
      <div id="reader" width="600px"></div>

      {isScanning && (
        <button
          onClick={() => stopScanner(scannerRef.current)}
          className="btn btn-secondary mt-4"
        >
          Detener Escaner
        </button>
      )}
    </div>
  );
};

export default BarcodeScanner;
