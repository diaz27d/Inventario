import { useEffect, useState } from "react";
import Layout from "../layaouts/Layaout";

import {
  FaEdit,
  FaPlus,
  FaSearch,
  FaSyncAlt
} from "react-icons/fa";

import { ENDPOINTS } from "../config/api";

import "../../css/Trabajadores.css";
import TrabajadorModal from "../pages/TrabajadorModal";
import EditarTrabajadorModal from "../pages/EditarTrabajadorModal";

function Trabajadores() {

  const [trabajadores, setTrabajadores] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState<any>(null);

  const cargarTrabajadores = async (
    paginaActual = 1,
    textoBusqueda = busqueda
  ) => {

    try {

      setLoading(true);

      const response = await fetch(
        `${ENDPOINTS.TRABAJADORES}?page=${paginaActual}&limit=10&busqueda=${textoBusqueda}`,
        {
          method: "POST"
        }
      );

      const data =
        await response.json();

      setTrabajadores(
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

    cargarTrabajadores();

  }, []);

  return (

    <Layout>

      <div className="trabajadores-page">

        <div className="trabajadores-header">

          <div>

            <h1>
              Trabajadores
            </h1>

            <p>
              Gestiona los trabajadores registrados
            </p>

          </div>

          <div className="acciones-header">

            <button
              className="btn-refresh"
              onClick={() =>
                cargarTrabajadores(
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

            <button
                className="btn-nuevo"
                onClick={() =>
                    setMostrarModal(true)
                }
                >
                <FaPlus />
                Nuevo Trabajador
            </button>

          </div>

        </div>

        <div className="buscador">

          <FaSearch
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Buscar trabajador..."
            value={busqueda}
            onChange={(e) => {

              setBusqueda(
                e.target.value
              );

              cargarTrabajadores(
                1,
                e.target.value
              );

            }}
          />

        </div>
        {loading ? (

            <div className="loading-container">

            <div className="spinner"></div>

            <p>Cargando productos...</p>

            </div>

            ) : (
            <div className="tabla-container">

            <table>

                <thead>

                <tr>

                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Teléfono</th>
                    <th>Cargo</th>
                    <th>Estado</th>
                    <th>Valor a pagar</th>
                    <th>Acciones</th>

                </tr>

                </thead>

                <tbody>

                {trabajadores.map(
                    (trabajador) => (

                    <tr
                    key={
                        trabajador.id_trabajador
                    }
                    >

                    <td>{trabajador.id_trabajador}
                    </td>

                    <td>{trabajador.nombre_trabajador}
                    </td>

                    <td>{trabajador.documento_trabajador}
                    </td>

                    <td>{trabajador.telefono_trabajador}
                    </td>

                    <td>{trabajador.cargo_trabajador}
                    </td>

                    <td>

                        <span
                        className={
                            trabajador.estado_trabajador === 1
                            ? "estado-activo"
                            : "estado-inactivo"
                        }
                        >

                        {
                            trabajador.estado_trabajador === 1
                            ? "Activo"
                            : "Inactivo"
                        }

                        </span>

                    </td>

                    <td>{Number(trabajador.valor_pagar_trabajador).toLocaleString('es-CO')}
                    </td>

                    <td
                        className="acciones"
                    >

                        <button
                            className="btn-editar"
                            onClick={() => {

                                setTrabajadorSeleccionado(
                                trabajador
                                );

                                setMostrarEditar(true);

                            }}
                            >
                            <FaEdit />
                        </button>

                    </td>

                    </tr>

                ))}

                </tbody>

            </table>
            
            <TrabajadorModal
                abierto={mostrarModal}
                onClose={() =>
                    setMostrarModal(false)
                }
                cargarTrabajadores={() =>
                    cargarTrabajadores(
                        pagina
                    )
                }
            />

            <EditarTrabajadorModal
                abierto={mostrarEditar}
                trabajador={trabajadorSeleccionado}
                onClose={() =>
                    setMostrarEditar(false)
                }
                cargarTrabajadores={() =>
                    cargarTrabajadores(
                        pagina
                    )
                }
            />

            <div className="paginacion">

                <button
                disabled={
                    pagina === 1
                }
                onClick={() =>
                    cargarTrabajadores(
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
                    cargarTrabajadores(
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

    </Layout>

  );

}

export default Trabajadores;