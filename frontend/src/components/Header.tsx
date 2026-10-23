import { useEffect, useState } from "react";
import "../../css/Layout.css";
import { ENDPOINTS } from "../config/api";

function Header() {

  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);

  const cargarNotificaciones =
    async () => {

      try {

        const response =
          await fetch(
            ENDPOINTS.NOTIFICACIONESSTOCK,
            {
              method: "POST"
            }
          );

        const data =
          await response.json();

        setNotificaciones(
          data.productos || []
        );

      } catch (error) {

        console.error(error);

      }

  };

  useEffect(() => {

    cargarNotificaciones();

  }, []);

  useEffect(() => {

      const handler = () => {

          cargarNotificaciones();

      };

      window.addEventListener(
          "actualizarNotificaciones",
          handler
      );

      return () => {

          window.removeEventListener(
              "actualizarNotificaciones",
              handler
          );

    };

  }, []);

  const user = JSON.parse(
    localStorage.getItem("user") ?? "{}"
  );

  const nombre =
    user?.nombre ||
    user?.name ||
    user?.username ||
    user?.fullName ||
    "Administrador";

  return (
    <header className="header">

      <div className="header-right">

        <div className="notificacion-container">

          <button
              className="btn-notificacion"
              onClick={() =>
                  setMostrarNotificaciones(
                      !mostrarNotificaciones
                  )
              }
          >
              🔔

              {notificaciones.length > 0 && (

                  <span className="badge-notificacion">
                      {notificaciones.length}
                  </span>

              )}

          </button>

          {mostrarNotificaciones && (

              <div className="panel-notificaciones" >

                  <h4>
                      Stock Bajo
                  </h4>
                      {
                      notificaciones.length === 0
                      ?
                      <p>
                          No hay alertas
                      </p>
                      :

                      notificaciones.map(
                          producto => (

                          <div
                              key={
                                producto.id_producto
                              }
                              className="item-notificacion"
                          >

                              <span>{ producto.nombre_producto }</span>

                              <strong>
                                  Stock: {producto.cantidad_producto}
                              </strong>
                          </div>
                      ))
                  }
              </div>
          )}

      </div>

        <div className="user-info">

          <div className="avatar">
            {nombre.charAt(0).toUpperCase()}
          </div>

          <span>
            {nombre}
          </span>

        </div>

      </div>

    </header>
  );
}

export default Header;