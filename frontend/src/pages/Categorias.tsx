import { useState, useEffect } from "react";
import Layout from "../layaouts/Layaout";
import { ENDPOINTS } from '../config/api'
import CategoriaModal from "../pages/CategoriaModal";


import {
  FaPlus,
  FaSearch,
  FaSyncAlt
} from "react-icons/fa";

import "../../css/Categorias.css";

interface CategoriExi {
    id_categoria: number,
    nombre_categoria: string
}

function Categorias() {

  const [busqueda, setBusqueda] = useState("");
  const [CategoriExi, setCategoriExi] = useState<CategoriExi[]>([])
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  
  const cargarCategoriExistentes = async (
        paginaActual = 1,
        textoBusqueda = busqueda
        ) => {
            try{
              
                setLoading(true);
                
                const response = await fetch(
                    `${ENDPOINTS.CATEGORIAS}?page=${paginaActual}&limit=5&busqueda=${textoBusqueda}`,
                    {
                    method: 'POST'
                    }
                );

                const data = await response.json();

                setCategoriExi(data.data);
                setPagina(data.meta.currentPage);
                setTotalPaginas(data.meta.lastPage);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
    };

    
  useEffect(() => {
    cargarCategoriExistentes()
  }, [])


  return (
    <Layout>

      <div className="categorias-page">

        <div className="categorias-header">

          <div>
            <h1>Categorías</h1>
            <p>
              Administra las categorías de productos.
            </p>
          </div>

          <div className="acciones-header">
              <button
                  className="btn-refresh"
                  onClick={() => cargarCategoriExistentes(pagina)}
                  disabled={loading}
                  title="Actualizar Categoría"
              >
                  <FaSyncAlt className={loading ? "girando" : ""} />
              </button>

              <button
                className="btn-nueva-categoria"
                disabled={loading}
                onClick={() =>
                  setMostrarModal(true)
                }
              >
                <FaPlus />
                Nueva Categoría
              </button>

              <CategoriaModal
                  abierto={mostrarModal}
                  onClose={() =>
                    setMostrarModal(false)
                  }
                  cargarCategoriExistentes={
                    cargarCategoriExistentes
                  }
                />
          </div>

        </div>

        <div className="buscador-categoria">

          <FaSearch />

          <input
            type="text"
            placeholder="Buscar categoría..."
            value={busqueda}
            onChange={(e) => {

                const valor = e.target.value;

                setBusqueda(valor);

                cargarCategoriExistentes(
                    1,
                    valor
                );
            }}
          />

        </div>
        {loading ? (

          <div className="loading-container">

          <div className="spinner"></div>

          <p>Cargando categorias...</p>

          </div>

          ) : (
        <div className="tabla-categorias">

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Categoría</th>
              </tr>
            </thead>

            <tbody>

              {CategoriExi.map((categoria) => (

                <tr key={categoria.id_categoria}>

                  <td>
                    {categoria.id_categoria
                      .toString()
                      .padStart(2, "0")}
                  </td>

                  <td>
                    {categoria.nombre_categoria}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
          <div className="paginacion">

            <button
                disabled={pagina === 1}
                onClick={() => cargarCategoriExistentes(pagina - 1)}
            >
                Anterior
            </button>

            <span>
                Página {pagina} de {totalPaginas}
            </span>

            <button
                disabled={pagina === totalPaginas}
                onClick={() => cargarCategoriExistentes(pagina + 1)}
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

export default Categorias;