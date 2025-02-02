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
          Sistema ada ADA 
        <div className="badge badge-lg">{dolarToday} bs

          
        </div>

        </div>

        <div className="hidden flex-none lg:block">
          <ul className="menu menu-horizontal">
            {/* Navbar menu content here */}
            <li>
              <a href="/ventas">Ventas</a>
            </li>
            <li>
              <a href="/inventario">Productos</a>
            </li>
            <li>
              <a href="/precios">Actualizador de precios</a>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 12H3.62" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.85 8.65002L2.5 12L5.85 15.35" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
