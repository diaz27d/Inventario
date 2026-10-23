import { useEffect, useState } from "react";
import Layout from "../layaouts/Layaout";
import DetalleVentaModal from "../pages/DetalleVentaModal";


import {
  FaEye,
  FaSearch,
  FaSyncAlt
} from "react-icons/fa";

import { ENDPOINTS } from "../config/api";

import "../../css/HistorialMovimientos.css";

function HistorialMovimientos() {

  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<any[]>([]);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const cargarMovimientos = async (
    paginaActual = 1,
    textoBusqueda = busqueda
  ) => {

    try {

      setLoading(true);

      const response = await fetch(
        `${ENDPOINTS.HISTORIALMOVIMIENTOS}?page=${paginaActual}&limit=5&busqueda=${textoBusqueda}`,
        {
          method: "POST"
        }
      );

      const data =
        await response.json();

      setMovimientos(
        data.data ?? []
      );

      setPagina(
        data.meta.currentPage
      );

      setTotalPaginas(
        data.meta.lastPage
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    cargarMovimientos();

  }, []);

  return (

    <Layout>

      <div className="historial-page">

        <div className="historial-header">

          <div>

            <h1>
              Historial de Ventas
            </h1>

            <p>
              Consulta las ventas registradas
            </p>

          </div>

          <div className="acciones-header">

            <button
              className="btn-refresh"
              onClick={() =>
                cargarMovimientos(
                  pagina
                )
              }
            >

              <FaSyncAlt
                className={
                  loading
                    ? "girando"
                    : ""
                }
              />

            </button>

          </div>

        </div>

        <div className="buscador">

          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => {

              setBusqueda(
                e.target.value
              );

              cargarMovimientos(
                1,
                e.target.value
              );

            }}
          />

        </div>
            {loading ? (

            <div className="loading-container">

            <div className="spinner"></div>

            <p>Cargando Historial Movimientos...</p>

            </div>

            ) : (
        <div className="tabla-container">

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total Venta</th>
                <th>Pagado</th>
                <th>Saldo</th>
                <th>Usuario</th>
                <th>Acciones</th>

              </tr>

            </thead>

            <tbody>

              {movimientos.map(
                (movimiento) => (

                <tr
                  key={
                    movimiento.id_valor_total
                  }
                >

                  <td>{movimiento.id_valor_total}</td>
                  <td>{movimiento.fecha_movimiento}</td>
                  <td>{movimiento.nombre_cliente}</td>
                  <td>
                    {Number(movimiento.valor_total).toLocaleString("es-CO")}
                  </td>
                  <td>
                    {Number(movimiento.valor_pagado).toLocaleString("es-CO")}
                  </td>
                  
                  <td>

                    <span
                      className={Number(movimiento.cuenta_por_cobrar) > 0
                        ? "saldo-pendiente"
                        : "saldo-pagado"
                      }
                    >

                     {Number(movimiento.cuenta_por_cobrar).toLocaleString("es-CO")}

                    </span>

                  </td>

                  <td>{movimiento.usuario}</td>

                  <td
                    className="acciones"
                  >

                    <button
                      className="btn-ver"
                      onClick={() => {
                        setMovimientoSeleccionado(
                          movimiento
                        );
                        setMostrarDetalle(
                          true
                        );
                      }}
                    >
                      <FaEye />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div className="paginacion">

            <button
              disabled={
                pagina === 1
              }
              onClick={() =>
                cargarMovimientos(
                  pagina - 1
                )
              }
            >
              Anterior
            </button>

            <span>

              Página {pagina} de {totalPaginas}

            </span>

            <button
              disabled={
                pagina === totalPaginas
              }
              onClick={() =>
                cargarMovimientos(
                  pagina + 1
                )
              }
            >
              Siguiente
            </button>

          </div>

        </div>
            )}

      </div>
      <DetalleVentaModal
          abierto={mostrarDetalle}
          idMovimiento={movimientoSeleccionado}
          onClose={() =>
              setMostrarDetalle(false)
          }
      />

    </Layout>

  );

}

export default HistorialMovimientos;