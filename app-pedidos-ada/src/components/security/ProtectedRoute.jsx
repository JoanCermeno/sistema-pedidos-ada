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
        alert("No hay token, redirigiendo al login");
        navigate("/login");
        return;
      }
      console.log("Token:", token);
      try {
        // Verifica el token con el backend
        const response = await axios.get("/api/validate-token", {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.status === 200) {
          setIsAuthenticated(true); // El token es válido
        } else {
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