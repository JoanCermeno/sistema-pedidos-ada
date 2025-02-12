import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useEffect } from "react";

const UpdatePrices = () => {
  const navigate = useNavigate();
  const [UltimoPrecio, setUltimoPrecio] = useState("");
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState(null);
  const [sussess, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iamLoadding, setIamLoadding] = useState(false);
  const date = new Date();
  const year = date.getFullYear();

  // Asegurarse de que el mes tenga dos dígitos
  const month = String(date.getMonth() + 1).padStart(2, "0");

  // Asegurarse de que el día tenga dos dígitos
  const day = String(date.getDate()).padStart(2, "0");

  // Formatear la fecha como DD-MM-YYYY
  const today = `${day}-${month}-${year}`;

  //console.log(today); // Ejemplo: "05-10-2023"

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      console.log("Estoy cargando");
      setIamLoadding(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasaDolar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ precio, today }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        throw new Error(data.message);
      }
      const data = await response.json();
      //  console.log(data);
      setSuccess("Precio actualizado a " + precio + " bs.");
      localStorage.setItem("dolar", precio);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleToastClick = () => {
    setIamLoadding(false);
  };

  useEffect(() => {
    const getUltimoPrecio = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${apiUrl}/tasaDolar`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al obtener el precio del dolar");
        }
        const data = await response.json();
        console.log(data);
        setUltimoPrecio(data.tasa);
        setUltimaActualizacion(data.fecha);
      } catch (error) {
        console.log(error);
      }
    };

    getUltimoPrecio();
  }, []);

  return (
    <>
      {/* Navbar */}

      <Navbar />

      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 shadow-lg rounded-lg">
          <div className="stats stats-vertical lg:stats-horizontal w-full bg-content shadow-xl bg-slate-100">
            <div className="stat">
              <div className="stat-title">Precio del dolar </div>
              <div className="stat-value">{UltimoPrecio} bs</div>
              <div className="stat-desc">
                Utilma vez actualizado
                <b className="pl-1"> {ultimaActualizacion}</b>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="my-4">
              <input
                type="number"
                step="0.01"
                className="input input-bordered w-full mt-5"
                placeholder="Ingrese el nuevo precio"
                onChange={(e) => setPrecio(e.target.value)}
                max={1000}
                min={0}
              />
              <small className="text-sm stat-desc">
                Actualizar el precio del dolar en la fecha de hoy es {today}
              </small>
            </div>
            {error && (
              <div className="animate-shake  text-red-900 text-center border-2  rounded-lg border-red-300  bg-red-100 py-2 mb-2">
                {error}
              </div>
            )}
            {sussess && (
              <div className="animate-shake  text-green-900 text-center border-2  rounded-lg border-green-300  bg-green-100 py-2 mb-2">
                {sussess}
              </div>
            )}
            <button
              type="submit"
              className="btn ease-in-out btn-primary w-full shadow-md hover:shadow-lg shadow-primary-500/50 hover:shadow-primary-400/50 duration-300 transition-all font-extrabold"
            >
              Actualizar dolar y precios
              {loading && (
                <span className="loading loading-spinner loading-md"></span>
              )}
            </button>

            {iamLoadding && (
              <div
                className="toast toast-end cursor-pointer"
                onClick={handleToastClick}
              >
                <div className="alert alert-info">
                  <span>Estoy cargando, dame un chance D_D</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePrices;
