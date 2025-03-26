import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Navbar = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    const handleHomeClick = () => {
        navigate("/");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const dolarToday = localStorage.getItem("dolar");

    return (
        <div className="drawer"> {/* Contenedor principal Drawer */}
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <div className="navbar  shadow-md w-full   justify-between">
                    {!isLoginPage && ( // **Mostrar el botón de hamburguesa SÓLO si NO es la página de login**
                        <div className="flex-none lg:hidden">
                            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
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
                    )}
                    <div
                        className="mx-2 fs-5 px-2 btn btn-ghost :hover:text-primary :hover:font-bold :hover:color-primary   cursor-pointer flex-1 lg:flex-none"
                        onClick={handleHomeClick}
                    >
                        {isLoginPage ? "SISTEMA ADA" :   // **Título condicional: "SISTEMA ADA" en login, "El dolar..." en otras páginas**
                            "El dolar esta en"
                        }
                        {!isLoginPage && ( // **Mostrar el badge de dolar SÓLO si NO es la página de login**
                            <div className="badge badge-lg">{dolarToday} bs</div>
                        )}
                    </div>
                    {!isLoginPage && ( // **Mostrar el menú horizontal SÓLO si NO es la página de login**
                        <div className="hidden flex-none lg:block">
                            <ul className="menu menu-horizontal">
                                {/* Navbar menu content here - MENÚ PRINCIPAL (DESKTOP) */}
                                <li>
                                    <Link to="/facturar">Caja</Link>
                                </li>
                                <li>
                                    <Link to="/inventario">Inventario</Link>
                                </li>
                                <li>
                                    <Link to="/precios">Actualizador de precios</Link>
                                </li>
                                <li>
                                    <Link to="/ventas">Ventas</Link>
                                </li>
                                <li>
                                    <Link to="/pendientes-por-cobrar">Pendientes por cobrar</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                    {!isLoginPage && ( // **Mostrar el dropdown de usuario SÓLO si NO es la página de login**
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="User Avatar"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                <li>
                                    <Link className="justify-between">
                                        Hola 👋🏼
                                        <span className="badge">admin</span>
                                    </Link>
                                </li>
                                <li>
                                    <a onClick={handleLogout}> Salir</a> {/* Este se mantiene como <a> porque llama a una función de logout */}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                {/* Page content will be rendered here - **RENDERIZAR CHILDREN AQUÍ** */}
                <div className="p-4">
                    {children} {/* Renderiza los componentes de página (children) aquí */}
                </div>

            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                    {/* Sidebar content here - MENÚ LATERAL (MOBILE) */}
                    <li>
                        <Link to="/facturar">Crear factura</Link>
                    </li>
                    <li>
                        <Link to="/inventario">Inventario</Link>
                    </li>
                    <li>
                        <Link to="/precios">Actualizador de precios</Link>
                    </li>
                    <li>
                        <Link to="/ventas">Ventas</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;