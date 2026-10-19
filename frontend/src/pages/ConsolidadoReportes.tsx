import { useState } from "react";
import Layout from "../layaouts/Layaout";
import {
  FaFileExcel,
  FaFilePdf
} from "react-icons/fa";

import "../../css/ConsolidadoReportes.css";

function ConsolidadoReportes() {
  const [periodo, setPeriodo] = useState("DIARIO");

  return (
    <Layout>

      <div className="reportes-page">

        <div className="report-card">

          <h2>Reportes de Inventario</h2>

          <div className="periodo-container">

            <label>Periodo *</label>

            <div className="radio-group">

              <label>
                <input
                  type="radio"
                  value="DIARIO"
                  checked={periodo === "DIARIO"}
                  onChange={(e) =>
                    setPeriodo(e.target.value)
                  }
                />
                Diario
              </label>

              <label>
                <input
                  type="radio"
                  value="SEMANAL"
                  checked={periodo === "SEMANAL"}
                  onChange={(e) =>
                    setPeriodo(e.target.value)
                  }
                />
                Semanal
              </label>

              <label>
                <input
                  type="radio"
                  value="MENSUAL"
                  checked={periodo === "MENSUAL"}
                  onChange={(e) =>
                    setPeriodo(e.target.value)
                  }
                />
                Mensual
              </label>

            </div>

          </div>

          <div className="fechas-container">

            <div>
              <label>Fecha Inicio</label>

              <input
                type="date"
              />
            </div>

            <div>
              <label>Fecha Fin</label>

              <input
                type="date"
              />
            </div>

            <button className="btn-generar">
              Generar
            </button>

          </div>

          <div className="cards-reportes">

            <div className="card-entrada">

              <span>Total Entradas</span>

              <h2>150</h2>

            </div>

            <div className="card-salida">

              <span>Total Salidas</span>

              <h2>80</h2>

            </div>

            <div className="card-stock">

              <span>Stock Actual</span>

              <h2>1.250</h2>

            </div>

          </div>

          <div className="grafica-container">

            <h3>
              Gráfico de Entradas vs Salidas
            </h3>

            <div className="fake-chart">

              <div className="grupo">
                <div className="barra azul h50"></div>
                <div className="barra roja h30"></div>
                <span>Lun</span>
              </div>

              <div className="grupo">
                <div className="barra azul h80"></div>
                <div className="barra roja h50"></div>
                <span>Mar</span>
              </div>

              <div className="grupo">
                <div className="barra azul h60"></div>
                <div className="barra roja h35"></div>
                <span>Mié</span>
              </div>

              <div className="grupo">
                <div className="barra azul h50"></div>
                <div className="barra roja h30"></div>
                <span>Jue</span>
              </div>

              <div className="grupo">
                <div className="barra azul h55"></div>
                <div className="barra roja h40"></div>
                <span>Vie</span>
              </div>

              <div className="grupo">
                <div className="barra azul h65"></div>
                <div className="barra roja h35"></div>
                <span>Sáb</span>
              </div>

              <div className="grupo">
                <div className="barra azul h75"></div>
                <div className="barra roja h45"></div>
                <span>Dom</span>
              </div>

            </div>

          </div>

          <div className="acciones-reportes">

            <button className="btn-excel">
              <FaFileExcel />
              Exportar Excel
            </button>

            <button className="btn-pdf">
              <FaFilePdf />
              Exportar PDF
            </button>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default ConsolidadoReportes;