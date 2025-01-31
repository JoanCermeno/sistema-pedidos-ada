import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";


const UpdatePrices = () => {
  const navigate = useNavigate();
  const [precio, setPrecio] = useState("");

  const [error, setError] = useState(null);
  // date today
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();   
  const today = `${day}-${month}-${year}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/precio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ precio, today }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        throw new Error(data.message);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
        {/* Navbar */}
    
        <Navbar />
    
    
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Precio del dolar hoy</h1>
        <small >{today}</small>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Tasa</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="60bs"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>
          {error && <div className="animate-shake  text-red-900 text-center border-2  rounded-lg border-red-300  bg-red-100 py-2 mb-2">{error}</div>}
          <button type="submit" className="btn ease-in-out btn-primary w-full shadow-md hover:shadow-lg shadow-primary-500/50 hover:shadow-primary-400/50 duration-300 transition-all">
            Actualizar
          </button>
        </form>
      </div>
    </div>
    </>

  );
};      

export default UpdatePrices;    