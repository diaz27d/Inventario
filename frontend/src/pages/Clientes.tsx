import { useEffect, useState } from "react";
import Layout from "../layaouts/Layaout";
import { ENDPOINTS } from "../config/api";
import ClienteModal from "../pages/ClienteModal";
import EditarClienteModal from "../pages/EditarClienteModal";

import {
  FaPlus,
  FaEdit,
  FaSearch,
  FaSyncAlt
} from "react-icons/fa";

import "../../css/Clientes.css";

interface Cliente {
  id_cliente: number;
  nombre_cliente: string;
  documento_cliente: string;
  telefono_cliente: string;
  estado_cliente: number;
  deuda_cliente?: number;
}

function Clientes() {

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);

  const cargarClientes = async (
    paginaActual = 1,
    textoBusqueda = busqueda
  ) => {
debugger;
    try {

      setLoading(true);

      const response = await fetch(
        `${ENDPOINTS.CLIENTES}?page=${paginaActual}&limit=5&busqueda=${textoBusqueda}`,
        {
          method: "POST"
        }
      );

      const data =
        await response.json();

      setClientes(
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

    cargarClientes();

  }, []);

  return (

    <Layout>

      <div className="clientes-page">

        <div className="clientes-header">

          <div>

            <h1>
              Clientes
            </h1>

            <p>
              Gestiona los clientes registrados
            </p>

          </div>

          <div className="acciones-header">

            <button
              className="btn-refresh"
              onClick={() =>
                cargarClientes(pagina)
              }
              disabled={loading}
              title="Actualizar clientes"
            >
              <FaSyncAlt className={loading ? "girando" : ""} />
            </button>

            <button
                className="btn-nuevo"
                onClick={() =>
                    setMostrarModal(true)
                }
                disabled={loading}
                >
                <FaPlus />
                Nuevo Cliente
            </button>

            <ClienteModal
                abierto={mostrarModal}
                onClose={() =>
                    setMostrarModal(false)
                }
                cargarClientes={() =>
                    cargarClientes(pagina)
                }
            />

          </div>

        </div>

        <div className="buscador">

          <FaSearch />

          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => {

              const valor =
                e.target.value;

              setBusqueda(valor);

              cargarClientes(
                1,
                valor
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
            <div className="tabla-clientes">

            <table>

                <thead>

                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>

                </thead>

                <tbody>

                {clientes.map(
                    (cliente) => (
                    <tr
                    key={cliente.id_cliente}
                    >
                    <td>{cliente.id_cliente}</td>
                    <td>{cliente.nombre_cliente}</td>
                    <td>{cliente.documento_cliente}</td>
                    <td>{cliente.telefono_cliente}</td>
                    
                    <td>
                        <span
                        className={
                            cliente.estado_cliente === 1
                            ? "estado-activo"
                            : "estado-inactivo"
                        }
                        >
                        {
                            cliente.estado_cliente === 1
                            ? "Activo"
                            : "Inactivo"
                        }

                        </span>

                    </td>

                    <td
                        className="acciones"
                    >
                        <button
                        className="btn-editar"
                        onClick={() => {setClienteSeleccionado(cliente);
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

            <EditarClienteModal
                abierto={mostrarEditar}
                cliente={clienteSeleccionado}
                onClose={() => setMostrarEditar(false)}
                cargarClientes={() => cargarClientes(pagina)}
                />

            <div className="paginacion">
                <button
                disabled={pagina === 1}
                onClick={() => cargarClientes(pagina - 1)}
                >
                Anterior
                </button>

                <span>
                Página {pagina} de {totalPaginas}
                </span>

                <button
                disabled={ pagina === totalPaginas }
                onClick={() => cargarClientes(pagina + 1)}
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

export default Clientes;