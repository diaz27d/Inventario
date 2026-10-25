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
          data.notificaciones || []
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
                      Notificaciones
                  </h4>
                      {
                      notificaciones.length === 0
                      ?
                      <p className="sin-notificaciones">
                          No hay alertas
                      </p>
                      :

                      notificaciones.map(
                          (
                            notificacion,
                            index
                          ) => (

                          <div
                              key={
                                index
                              }
                              className={`item-notificacion ${notificacion.tipo}`}
                          >
                               <div>
                                  <strong>
                                      {
                                          notificacion.titulo
                                      }
                                  </strong>

                                  <p>
                                      {
                                          notificacion.mensaje
                                      }
                                  </p>

                              </div>
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