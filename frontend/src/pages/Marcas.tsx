import { useState, useEffect } from "react";
import Layout from "../layaouts/Layaout";
import { ENDPOINTS } from '../config/api'
import MarcaModal from "../pages/MarcaModal";
import {
  FaPlus,
  FaEdit,
  FaSearch,
  FaSyncAlt
} from "react-icons/fa";
import EditarMarcaModal from '../pages/EditarMarcaModal'

import "../../css/Marcas.css";

interface MarcaExis {
    id_marca: number,
    nombre_marca: string
}

function Marcas() {

  const [busqueda, setBusqueda] = useState("");
  const [MarcaExis, setMarcaExis] = useState<MarcaExis[]>([])
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<any>(null)
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [licenciaVencida, setLicenciaVencida] = useState(false);

    useEffect(() => { 
      cargarMarcasExistentes()
    }, [])

    const cargarMarcasExistentes = async (
        paginaActual = 1,
        textoBusqueda = busqueda
        ) => {
            try{
              
                setLoading(true);
                
                const response = await fetch(
                    `${ENDPOINTS.MARCAS}?page=${paginaActual}&limit=5&busqueda=${textoBusqueda}`,
                    {
                    method: 'POST'
                    }
                );

                const data = await response.json();

                setMarcaExis(data.data);
                setPagina(data.meta.currentPage);
                setTotalPaginas(data.meta.lastPage);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
    };

    const validarLicencia = async () => {
    try {

      const response =
        await fetch(
          ENDPOINTS.VALIDARLICENCIA,
          {
            method: 'POST'
          }
        )

      const data =
        await response.json()

      setLicenciaVencida(
        data.disabled
      )

    } catch (error) {

      console.error(error)

    }

  };

  useEffect(() => {
    validarLicencia()
  }, []);

  return (
    <Layout>

      <div className="marcas-page">

        <div className="marcas-header">

          <div>
            <h1>Marcas</h1>

            <p>
              Administra las marcas de productos.
            </p>
          </div>

          <div className="acciones-header">
            <button
                className="btn-refresh"
                onClick={() => cargarMarcasExistentes(pagina)}
                disabled={loading}
                title="Actualizar Marcas"
            >
                <FaSyncAlt className={loading ? "girando" : ""} />
            </button>

            <button
              className="btn-nueva-marca"
              disabled={loading}
              onClick={() =>
                setMostrarModal(true)
              }
            >
              <FaPlus />
              Nueva Marca
          </button>

            <MarcaModal
                abierto={mostrarModal}
                desabilitar={licenciaVencida}
                onClose={() =>
                  setMostrarModal(false)
                }
                cargarMarcasExistentes={
                  cargarMarcasExistentes
                }
              />
        </div>

        </div>

        

        <div className="buscador-marcas">

          <FaSearch />

          <input
            type="text"
            placeholder="Buscar marca..."
            value={busqueda}
            onChange={(e) => {

                const valor = e.target.value;

                setBusqueda(valor);

                cargarMarcasExistentes(
                    1,
                    valor
                );
            }}
          />

        </div>
        {loading ? (

          <div className="loading-container">

          <div className="spinner"></div>

          <p>Cargando marcas...</p>

          </div>

          ) : (
        <div className="tabla-marcas">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {MarcaExis.map((marca) => (

                <tr key={marca.id_marca}>

                  <td>
                    {marca.id_marca
                      .toString()
                      .padStart(2, "0")}
                  </td>

                  <td>{marca.nombre_marca}</td>

                                          <td className="acciones">

                        <button className="btn-editar"
                            onClick={() => {
                                setMarcaSeleccionada(marca);
                                setMostrarEditar(true);
                            }}>
                            <FaEdit />
                        </button>
                        </td>

                </tr>

              ))}

            </tbody>

          </table>
          <div className="paginacion">

              <button
                  disabled={pagina === 1}
                  onClick={() => cargarMarcasExistentes(pagina - 1)}
              >
                  Anterior
              </button>

              <span>
                  Página {pagina} de {totalPaginas}
              </span>

              <button
                  disabled={pagina === totalPaginas}
                  onClick={() => cargarMarcasExistentes(pagina + 1)}
              >
                  Siguiente
              </button>

          </div>

        </div>
          )
        }

        <EditarMarcaModal
          abierto={mostrarEditar}
          marca={marcaSeleccionada}
          onClose={() =>
              setMostrarEditar(false)
          }
          cargarMarcasExistentes={
              cargarMarcasExistentes
          }
          desabilitar={licenciaVencida}
      />

      </div>

    </Layout>
  );
}

export default Marcas;