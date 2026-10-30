import { useState } from "react";
import Layout from "../layaouts/Layaout";
import { ENDPOINTS } from "../config/api";
import Swal from "sweetalert2";
import {
  FaFileExcel,
} from "react-icons/fa";

import "../../css/ConsolidadoReportes.css";

function ConsolidadoReportes() {
  
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reporte, setReporte] = useState<any>(null);

  const generarReporte = async () => {

  if ( !fechaInicio || !fechaFin ) {
    Swal.fire({
                icon: "warning",
                title: "Error",
                text: "Debe ingresar las fechas de inicio y fin"
    });
    return;
  }

  const response =
    await fetch(
      ENDPOINTS.CONSOLIDADOREPORTES,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          fecha_inicio:
            fechaInicio,

          fecha_fin:
            fechaFin

        })

      }
    );

  const data =
    await response.json();

  setReporte(data);

};

const exportarExcel = async () => {

  const response =
    await fetch(
      ENDPOINTS.EXPORTAREXCEL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          fecha_inicio:
            fechaInicio,

          fecha_fin:
            fechaFin

        })
      }
    )

  const blob = await response.blob()

  const url = window.URL.createObjectURL( blob )
  const a = document.createElement("a")
  a.href = url
  a.download = `Reporte_${fechaInicio}_${fechaFin}.xlsx`
  a.click()
}

  return (
    <Layout>

      <div className="reportes-page">

        <div className="report-card">

          <h2>Reportes de Inventario y Ventas</h2>

          <div className="periodo-container">

            <label>Periodo *</label>

          </div>

          <div className="fechas-container">

            <div>
              <label>Fecha Inicio</label>

              <input
                type="date"
                value={fechaInicio}
                onChange={(e) =>
                  setFechaInicio(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label>Fecha Fin</label>

              <input
                type="date"
                value={fechaFin}
                onChange={(e) =>
                  setFechaFin(
                    e.target.value
                  )
                }
              />
            </div>

            <button 
            className="btn-generar"
            onClick={
              generarReporte
            }>
              Generar
            </button>

          </div>

          <div className="row">
            <h2>Ventas</h2>
          </div>

          <div className="cards-reportes">

            <div className="card-entrada">

              <span>Numero de ventas realizadas</span>

              <h2>
                {reporte?.numeroVentas || 0}
              </h2>

            </div>

            <div className="card-salida">

              <span>Total ingresado</span>

              <h2>
                $
                {Number(
                  reporte?.totalIngresado || 0
                ).toLocaleString(
                  "es-CO"
                )}

              </h2>

            </div>

            <div className="card-stock">

              <span>Total pendiente por clientes</span>              

              <h2>
                $
                {Number(
                  reporte?.totalPendiente || 0
                ).toLocaleString(
                  "es-CO"
                )}

              </h2>

            </div>

          </div>

          <div className="acciones-reportes">

            <button className="btn-excel"
              onClick={exportarExcel}
            >
              <FaFileExcel />
              Exportar Excel
            </button>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default ConsolidadoReportes;