import { useEffect, useState } from "react";
import Layout from "../layaouts/Layaout";

import {
  FaSearch,
  FaSyncAlt,
  FaEye
} from "react-icons/fa";

import { ENDPOINTS } from "../config/api";

import "../../css/DeudasClientes.css";
import DetalleDeudaModal from "../pages/DetalleDeudaModal";

function DeudasClientes() {

  const [deudas, setDeudas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mostrarModalDeuda, setMostrarModalDeuda] = useState(false); 
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);

  const cargarDeudas = async (
    paginaActual = 1,
    textoBusqueda = busqueda
  ) => {

    try {

      setLoading(true);

      const response = await fetch(
        `${ENDPOINTS.CLIENTEDEUDAS}?page=${paginaActual}&limit=5&busqueda=${textoBusqueda}`,
        {
          method: "POST"
        }
      );

      const data =
        await response.json();

      setDeudas(
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

    cargarDeudas();

  }, []);

  return (

    <Layout>

      <div className="deudas-page">

        <div className="deudas-header">

          <div>

            <h1>
              Deudas Clientes
            </h1>

            <p>
              Gestiona las cuentas por cobrar
            </p>

          </div>

          <div className="acciones-header">

            <button
              className="btn-refresh"
              disabled={loading}
              onClick={() =>
                cargarDeudas(pagina)
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

          <FaSearch
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => {

              const valor =
                e.target.value;

              setBusqueda(valor);

              cargarDeudas(
                1,
                valor
              );

            }}
          />

        </div>

        {loading ? (

            <div className="loading-container">

            <div className="spinner"></div>

            <p>Cargando deudas clientes...</p>

            </div>

            ) : (

          <div className="tabla-deudas">

            <table>

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Deuda</th>
                  <th>Estado</th>
                  <th>Acciones</th>

                </tr>

              </thead>

              <tbody>

                {deudas.map(
                  (cliente) => (

                  <tr
                    key={
                      cliente.id_cliente
                    }
                  >

                    <td>
                      {
                        cliente.id_cliente
                      }
                    </td>

                    <td>
                      {
                        cliente.nombre_cliente
                      }
                    </td>

                    <td>
                      {
                        cliente.documento_cliente
                      }
                    </td>

                    <td>
                      {
                        cliente.telefono_cliente
                      }
                    </td>

                    <td>

                      <span className="deuda-valor">

                        $

                        {Number(
                          cliente.deuda
                        ).toLocaleString(
                          "es-CO"
                        )}

                      </span>

                    </td>

                    <td>

                      <span
                        className={
                          Number(
                            cliente.deuda
                          ) > 0
                          ? "estado-pendiente"
                          : "estado-saldado"
                        }
                      >

                        {Number(
                          cliente.deuda
                        ) > 0
                          ? "Pendiente"
                          : "Saldado"}

                      </span>

                    </td>

                    <td
                      className="acciones"
                    >

                      <button
                        className="btn-ver"
                        onClick={() => {
                            setClienteSeleccionado(
                                cliente
                            );

                            setMostrarModalDeuda(
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
                disabled={pagina === 1}
                onClick={() =>
                  cargarDeudas(
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
                  cargarDeudas(
                    pagina + 1
                  )
                }
              >
                Siguiente
              </button>

            </div>

          </div>
          )
          }

      </div>

      <DetalleDeudaModal
          abierto={mostrarModalDeuda}
          cliente={clienteSeleccionado}
          onClose={() =>
              setMostrarModalDeuda(false)
          }
           recargarDeudas={() =>
              cargarDeudas(
                  pagina,
                  busqueda
              )
          }
      />

    </Layout>

  );

}

export default DeudasClientes;