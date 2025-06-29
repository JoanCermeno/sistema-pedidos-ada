import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LoginForm = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    
    const apiUrl = import.meta.env.VITE_API_URL;
    //validar que apiURL este en la variable de entorno
    if (!apiUrl) {
      e.preventDefault();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La variable de entorno VITE_API_URL no está definida, si este error persite revisa la documentación de la aplicación",
      });
      return;
    }


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
        console.log(data);
        throw new Error(data.message);
      }

      const data = await response.json();
      localStorage.setItem("token", `Bearer ${data.token}`);
      console.log("mandando al home");
      navigate("/");
    } catch (error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        
        title: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 shadow-xl rounded-lg bg-base-200 border-base-400 text-base-content"> 
        <h1 className="text-2xl font-bold mb-4 text-center">
          iniciar sesión
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Usuario
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Nombre de usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium ">
              Clave
            </label>
            <input
              type="password"
              className="input input-bordered w-full   shadow-sm"
              placeholder="Clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn  btn-accent w-full shadow-md  font-bold text-md "
          >
            Entrar
            {loading && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
          </button>
          <div className="flex flex-col justify-center items-center gap-1 pt-5">
            <small>
              Olvidaste tu contraseña? <a href="/resetPassword">Recuperar</a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
