import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // Si no hay token, redirige al login
        navigate("/login");
        return;
      }
      try {
        // Verifica el token con el backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/validateTokenSession`, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          },
          method: "POST",
          body: JSON.stringify({ token }),
        
        });

        if (response.status === 200) {
          console.log("Token is valid");
          setIsAuthenticated(true); // El token es válido
        } else {
          console.warn("Token is not valid");
          console.log("Response:", response);
          localStorage.removeItem("token"); // Elimina el token inválido
          navigate("/login"); // Redirige al login
        }
      } catch (error) {
        console.error("Error validating token:", error);
        localStorage.removeItem("token"); // Elimina el token inválido
        navigate("/login"); // Redirige al login
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    validateToken();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Muestra un spinner o mensaje de carga
  }

  return isAuthenticated ? <Outlet /> : null; // Renderiza la ruta protegida si está autenticado
};

export default ProtectedRoute;