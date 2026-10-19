import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react'
import {
  FaHome,
  FaBox,
  FaTags,
  FaWarehouse,
  FaSignOutAlt,
  FaClipboardList,
  FaChartBar,
  FaHistory
} from "react-icons/fa";

import {  } from "react-router-dom";
import { ENDPOINTS } from "../config/api";
import Swal from "sweetalert2";
import '../../css/Slidebar.css'

function Sidebar() {

    const navigate = useNavigate();

    const [inventarioAbierto, setInventarioAbierto] = useState(false);

    const cerrarSesion = async () => {

    const resultado = await Swal.fire({
        title: "¿Cerrar sesión?",
        text: "Se finalizará la sesión actual",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, cerrar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc2626"
    });

    if (!resultado.isConfirmed) return;

    try {

        const token = localStorage.getItem("token");

        await fetch(ENDPOINTS.LOGOUT, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
        });

        localStorage.removeItem("token");

        Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        timer: 1500,
        showConfirmButton: false
        });

        navigate("/");

    } catch (error) {

        console.error(error);

        Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible cerrar la sesión"
        });
    }
};

  return (
    <aside className="sidebar">

      <div className="logo">
        📦 Inventario
      </div>

      <ul>

        <li>
          <Link to="/home">
            <FaHome /> Dashboard
          </Link>
        </li>

        <li>
          <Link to="/productos">
            <FaBox /> Productos
          </Link>
        </li>

        <li>
          <Link to="/categorias">
            <FaTags /> Categorías
          </Link>
        </li>

        <li>
          <Link to="/marcas">
            <FaTags /> Marcas
          </Link>
        </li>


        <li
          onClick={() => setInventarioAbierto(!inventarioAbierto)}
          className="menu-expandible"
        >
          <div className="menu-item">
            <FaWarehouse />
            <span>Ventas</span>
          </div>

          <span>
            {inventarioAbierto ? "▼" : "▶"}
          </span>
        </li>

        {inventarioAbierto && (
          <ul className="submenu">

            <li>
              <Link to="/registro-inventario">
                <FaHistory/> Registro Ventas
              </Link>
            </li>

            <li>
              <Link to="/historial-movimientos">
                <FaClipboardList/> Historial Movimientos
              </Link>
            </li>

          </ul>
        )}

        
        <li>
          <Link to="/consolidado-reportes">
            <FaChartBar /> Consolidado Reportes
          </Link>
        </li>

      </ul>

      <div className="logout" onClick={(e) => {
                        e.preventDefault();
                        cerrarSesion();
                    }}>
        <FaSignOutAlt /> Cerrar sesión
      </div>

    </aside>
  );
}

export default Sidebar;