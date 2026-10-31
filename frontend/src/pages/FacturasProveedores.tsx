import { useEffect, useState } from "react";

import Layout from "../layaouts/Layaout";

import {
    FaEdit,
    FaPlus,
    FaSearch,
    FaSyncAlt
} from "react-icons/fa";

import { ENDPOINTS } from "../config/api";

import "../../css/FacturasProveedores.css";
import NuevaFacturaProveedorModal from "../pages/NuevaFacturaProveedorModal";
import EditarFacturaProveedorModal from "../pages/EditarFacturaProveedorModal"

function FacturasProveedores() {

    const [facturas, setFacturas] = useState<any[]>([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);

    const cargarFacturas = async (
        paginaActual = 1,
        textoBusqueda = busqueda
    ) => {

        try {

            setLoading(true);

            const response =
                await fetch(

                    `${ENDPOINTS.FACTURASPROVEEDOR}?page=${paginaActual}&limit=5&busqueda=${textoBusqueda}`,
                    {
                        method: "POST"
                    }
                );

            const data = await response.json();

            setFacturas( data.data ?? [] );
            setPagina( data.meta.currentPage );
            setTotalPaginas( data.meta.lastPage );

        } catch (error) {

            console.error(error);

        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {

        cargarFacturas();

    }, []);

    return (

        <Layout>

            <div className="facturas-page">

                <div className="facturas-header">

                    <div>

                        <h1>
                            Facturas Proveedores
                        </h1>

                        <p>
                            Gestiona las compras realizadas a proveedores
                        </p>

                    </div>

                    <div className="acciones-header">

                        <button
                            className="btn-refresh"
                            onClick={() =>
                                cargarFacturas(
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

                            Nueva Factura
                        </button>

                    </div>

                </div>

                <div className="buscador">

                    <FaSearch
                        className="search-icon"
                    />

                    <input
                        type="text"
                        placeholder="Buscar factura..."
                        value={busqueda}
                        onChange={(e) => {

                            setBusqueda(
                                e.target.value
                            );

                            cargarFacturas(
                                1,
                                e.target.value
                            );

                        }}
                    />

                </div>

                {loading ? (

                <div className="loading-container">

                <div className="spinner"></div>

                <p>Cargando Facturas...</p>

                </div>

                ) : (

                <div className="tabla-container">

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Factura</th>
                                <th>Fecha</th>
                                <th>Proveedor</th>
                                <th>Total</th>
                                <th>Total Abonado</th>
                                <th>Total Pendiente</th>
                                <th>Estado</th>
                                <th>Fecha Vencimiento</th>
                                <th>Acciones</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                facturas.map(
                                    factura => (

                                    <tr
                                        key={ factura.id_factura_proveedor }
                                    >

                                        <td>{ factura.id_factura_proveedor }
                                        </td>

                                        <td>{ factura.numero_factura }
                                        </td>

                                        <td>{ factura.fecha_factura }
                                        </td>

                                        <td>{ factura.nombre_proveedor }
                                        </td>

                                        <td>
                                            $
                                            {Number( factura.total_factura ).toLocaleString("es-CO")}
                                        </td>

                                        <td>
                                            $
                                            {Number( factura.total_abonado ).toLocaleString("es-CO")}
                                        </td>

                                        <td>
                                            $
                                            {Number( factura.total_pendiente ).toLocaleString("es-CO")}

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    factura.estado_pago === 1
                                                    ? "estado-activo"
                                                    : "estado-inactivo"
                                                }
                                            >
                                                {
                                                    factura.estado_pago === 1
                                                    ? "Pagada"
                                                    : "Pendiente"
                                                }

                                            </span>

                                        </td>

                                        <td>{ factura.fecha_vecimiento }
                                        </td>

                                        <td
                                            className="acciones"
                                        >

                                            <button
                                                className="btn-editar"
                                                onClick={() => {
                                                    setFacturaSeleccionada(
                                                        factura
                                                    );
                                                    setMostrarEditar(
                                                        true
                                                    );

                                                }}
                                            >
                                                <FaEdit />
                                            </button>

                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                    <div className="paginacion">

                        <button
                            disabled={
                                pagina === 1
                            }
                            onClick={() =>
                                cargarFacturas(
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
                                cargarFacturas(
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

            <NuevaFacturaProveedorModal
                abierto={mostrarModal}
                onClose={() =>
                    setMostrarModal(false)
                }
                cargarFacturas={() =>
                    cargarFacturas(
                        pagina
                    )
                }

            />

            <EditarFacturaProveedorModal
                abierto={mostrarEditar}
                factura={facturaSeleccionada}
                onClose={() =>
                    setMostrarEditar(false)
                }
                cargarFacturas={() =>
                    cargarFacturas(
                        pagina
                    )
                }
            />

        </Layout>

    );

}

export default FacturasProveedores;