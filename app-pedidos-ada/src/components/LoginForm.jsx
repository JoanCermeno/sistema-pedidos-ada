import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    setLoading(true);
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
        throw new Error("Usuario o contraseña incorrectos");
      }

      const data = await response.json();
      localStorage.setItem("token", `Bearer ${data.token}`);
      console.log("mandando al home");
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const hiddenErrorMs = () => {
    setError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 shadow-xl rounded-lg bg-slate-50">
        <h1 className="text-2xl font-bold mb-4 text-center text-orange-950">
          Sistema ADA
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Usuario
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-gray-50 text-orange-950 hadow-sm"
              placeholder="Nombre de usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Clave
            </label>
            <input
              type="password"
              className="input input-bordered w-full bg-gray-50  shadow-sm text-orange-950"
              placeholder="Clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
          </div>
          {error && (
            <div
              onClick={hiddenErrorMs}
              className="animate-shake hover:cursor-pointer    text-red-900 text-center border-2  rounded-lg border-red-300  bg-red-100 py-2 mb-2"
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn  btn-accent w-full shadow-md hover:shadow-orange-950 font-bold text-md "
          >
            Entrar
            {loading && (
              <span class="loading loading-spinner loading-sm"></span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
