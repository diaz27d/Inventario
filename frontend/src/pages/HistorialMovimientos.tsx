import Layout from "../layaouts/Layaout";
import { FaSearch } from "react-icons/fa";

import "../../css/HistorialMovimientos.css";

function HistorialMovimientos() {

  const movimientos = [
    {
      id: 1,
      fecha: "12/10/2026",
      producto: "Laptop HP",
      tipo: "Entrada",
      cantidad: 30,
      usuario: "Admin"
    },
    {
      id: 2,
      fecha: "12/10/2026",
      producto: "Laptop HP",
      tipo: "Salida",
      cantidad: 5,
      usuario: "Admin"
    },
    {
      id: 3,
      fecha: "11/10/2026",
      producto: "Impresora Epson",
      tipo: "Entrada",
      cantidad: 15,
      usuario: "Admin"
    },
    {
      id: 4,
      fecha: "11/10/2026",
      producto: "Mouse Logitech",
      tipo: "Salida",
      cantidad: 3,
      usuario: "Admin"
    }
  ];

  return (
    <Layout>

      <div className="historial-page">

        <div className="card-historial">

          <h2>
            Historial de Movimientos
          </h2>

          <div className="buscar-movimiento">

            <FaSearch />

            <input
              type="text"
              placeholder="Buscar..."
            />

          </div>

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Usuario</th>
              </tr>

            </thead>

            <tbody>

              {movimientos.map((movimiento) => (

                <tr key={movimiento.id}>

                  <td>
                    {String(
                      movimiento.id
                    ).padStart(3, "0")}
                  </td>

                  <td>
                    {movimiento.fecha}
                  </td>

                  <td>
                    {movimiento.producto}
                  </td>

                  <td>

                    <span
                      className={
                        movimiento.tipo === "Entrada"
                          ? "badge-entrada"
                          : "badge-salida"
                      }
                    >
                      {movimiento.tipo}
                    </span>

                  </td>

                  <td>
                    {movimiento.cantidad}
                  </td>

                  <td>
                    {movimiento.usuario}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
}

export default HistorialMovimientos;