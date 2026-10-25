import { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaSyncAlt 
} from "react-icons/fa";

import "../../css/Productos.css";
import "../../css/Spinner.css";
import Swal from "sweetalert2";
import Layout from "../layaouts/Layaout";
import ProductoModal from "../pages/ProductoModal";
import EditarProductoModal from '../pages/EditarProductoModal'
import { ENDPOINTS } from '../config/api'

interface ProducExist {
    id_producto: number,
    nombre_producto: string,
    categoria_producto: string,
    marca_producto: string,
    precio_producto: number,
    precio_adquirido_producto: number,
    cantidad_producto: number,
    estado_producto: number,
    descripcion_producto: string
}

interface MarcaExis {
    id_marca: number,
    nombre_marca: string
}

interface CategoriExi {
    id_categoria: number,
    nombre_categoria: string
}


function Productos() {

  const [busqueda, setBusqueda] = useState("");
  const [ProductoExist, setProductoExist] = useState<ProducExist[]>([])
  const [MarcaExis, setMarcaExis] = useState<MarcaExis[]>([])
  const [CategoriExi, setCategoriExi] = useState<CategoriExi[]>([])
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [licenciaVencida, setLicenciaVencida] = useState(false);
  

    const cargarProductos = async (
        paginaActual = 1,
        textoBusqueda = busqueda
        ) => {
            try{
                setLoading(true);
                const response = await fetch(
                    `${ENDPOINTS.PRODUCTOS}?page=${paginaActual}&limit=5&busqueda=${textoBusqueda}`,
                    {
                    method: 'POST'
                    }
                );

                const data = await response.json();

                setProductoExist(data.data);
                setPagina(data.meta.currentPage);
                setTotalPaginas(data.meta.lastPage);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
    };

  useEffect(() => {
      cargarProductos()
    }, [])


    useEffect(() => {
        const cargarMarcasExistentes = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                ENDPOINTS.MARCAS_COMBOS,
                {method: 'POST'}
            )
    
            const data = await response.json()
    
            setMarcaExis(data ?? [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
        }

        cargarMarcasExistentes()
    }, [])

    useEffect(() => {
        const cargarCategoriExistentes = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                ENDPOINTS.CATEGORIAS_COMBOS,
                {method: 'POST'}
            )
    
            const data = await response.json()
    
            setCategoriExi(data ?? [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
        }

        cargarCategoriExistentes()
    }, [])

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
        <div className="productos-page">

        <div className="productos-header">
            <div>
            <h1>Productos</h1>
            <p>Gestiona los productos del inventario</p>
            </div>
            
            <div className="acciones-header">
                <button
                    className="btn-refresh"
                    onClick={() => cargarProductos(pagina)}
                    disabled={loading}
                    title="Actualizar productos"
                >
                    <FaSyncAlt className={loading ? "girando" : ""} />
                </button>

                <button className="btn-nuevo"
                    disabled={loading}
                    onClick={() => setMostrarModal(true)}>
                <FaPlus />
                Nuevo Producto
                </button>
            </div>

            <ProductoModal
                abierto={mostrarModal}
                onClose={() => setMostrarModal(false)}                
                categorias={CategoriExi}
                marcas={MarcaExis}
                cargarProductos={cargarProductos}
                desabilitar={licenciaVencida}
            />
        </div>

        <div className="buscador">
            <FaSearch className="search-icon" />

            <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => {
                    const valor = e.target.value;

                    setBusqueda(valor);

                    cargarProductos(1, valor);

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
                    <th>Categoría</th>
                    <th>Marca</th>
                    <th>Precio producto</th>
                    <th>Precio adquirido</th>
                    <th>Cantidad</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {ProductoExist.map((producto) => (
                    <tr key={producto.id_producto}>
                        <td>{producto.id_producto}</td>
                        <td>{producto.nombre_producto}</td>
                        <td>{producto.categoria_producto}</td>
                        <td>{producto.marca_producto}</td>
                        <td>{Number(producto.precio_producto).toLocaleString('es-CO')}</td>
                        <td>{Number(producto.precio_adquirido_producto).toLocaleString('es-CO')}</td>
                        <td>{producto.cantidad_producto}</td>
                        <td>
                            <button
                                className="btn-ver"
                                onClick={() =>
                                Swal.fire({
                                    title: 'Descripción',
                                    text: producto.descripcion_producto
                                })
                                }
                            >
                                Ver
                            </button>
                        </td>
                        <td>
                        <span
                            className={
                            producto.estado_producto == 1
                                ? "estado activo"
                                : "estado inactivo"
                            }
                        >
                            {producto.estado_producto == 1 ? "Activo" : 'Inactivo'}
                        </span>
                        </td>

                        <td className="acciones">

                        <button className="btn-editar"
                            onClick={() => {
                                setProductoSeleccionado(producto);
                                setMostrarEditar(true);
                            }}>
                            <FaEdit />
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>

                </table>

                <EditarProductoModal
                    abierto={mostrarEditar}
                    onClose={() => setMostrarEditar(false)}
                    producto={productoSeleccionado}
                    categorias={CategoriExi}
                    marcas={MarcaExis}
                    cargarProductos={cargarProductos}
                    desabilitar={licenciaVencida}
                />

                <div className="paginacion">

                    <button
                        disabled={pagina === 1}
                        onClick={() => cargarProductos(pagina - 1)}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {pagina} de {totalPaginas}
                    </span>

                    <button
                        disabled={pagina === totalPaginas}
                        onClick={() => cargarProductos(pagina + 1)}
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

export default Productos;