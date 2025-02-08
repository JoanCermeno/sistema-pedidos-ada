import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

  const dolarToday = localStorage.getItem("dolar");

  return (
    <>
      <div className="navbar bg-base-50 shadow-md w-full border-b-2  border-amber-50  flex justify-between mb-5">
        <div className="flex-none lg:hidden">
          <label
            htmlFor="my-drawer-3"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div
          className="mx-2 fs-5 px-2 btn btn-ghost :hover:text-primary :hover:font-bold :hover:color-primary  cursor-pointer "
          onClick={handleHomeClick}
        >
         El dolar esta en
        <div className="badge badge-lg">{dolarToday} bs

          
        </div>

        </div>

        <div className="hidden flex-none lg:block">
          <ul className="menu menu-horizontal">
            {/* Navbar menu content here */}
            <li>
              <a href="/facturar">Crear factura</a>
            </li>
            <li>
              <a href="/inventario">Inventario</a>
            </li>
            <li>
              <a href="/precios">Actualizador de precios</a>
            </li>
            <li>
              <a href="/ventas">Ventas</a>
            </li>
          </ul>

        </div>
        {/* Dropdown user Menu */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Hola 👋🏼
                <span className="badge">admin</span>
              </a>
            </li>
            <li>
              <a onClick={handleLogout}> Salir
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
