import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: usuario, pass: clave }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        throw new Error("Error en la autenticación");
      }

      const data = await response.json();
      localStorage.setItem("token", `Bearer ${data.token}`);
      navigate("/dashboard"); // Redirige al Home
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Sistemas de pedido ADA
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Usuario</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Nombre de usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Clave</label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="btn btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
