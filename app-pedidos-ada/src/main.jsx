import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // El archivo que contiene las rutas
import "./index.css";

const RootComponent = () => {
  useEffect(() => {
    const htmlElement = document.documentElement;

    const updateTheme = (prefersDark) => {
      if (prefersDark) {
        htmlElement.setAttribute('data-theme', 'dark'); // O el nombre de tu tema oscuro
      } else {
        htmlElement.setAttribute('data-theme', 'light'); // O el nombre de tu tema claro
      }
    };

    // Verificar la preferencia inicial
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateTheme(prefersDarkScheme);

    // Escuchar cambios en la preferencia (opcional)
    const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      updateTheme(event.matches);
    };
    colorSchemeQueryList.addEventListener('change', handleChange);

    return () => {
      colorSchemeQueryList.removeEventListener('change', handleChange);
    };
  },); // El array de dependencias vacío asegura que esto se ejecute solo una vez al montar el componente

  return (
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<RootComponent />);