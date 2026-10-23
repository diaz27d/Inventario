import { useEffect, useState } from "react";

import {
    ENDPOINTS
} from "../config/api";

import "../../css/DetalleDeudaModal.css";

interface Props {
    abierto: boolean;
    idMovimiento: any;
    onClose: () => void;
}

function DetalleVentaModal({
    abierto,
    idMovimiento,
    onClose
}: Props) {

    const [resumenVenta, setResumenVenta] = useState<any>(null);
    const [detalleVenta, setDetalleVenta] = useState<any[]>([]);

    useEffect(() => {

        if ( abierto && idMovimiento) {
            cargarDetalleVenta();
        }

    }, [
        abierto,
        idMovimiento
    ]);

    const cargarDetalleVenta =
        async () => {

        try {

            const response =
                await fetch(
                    ENDPOINTS.DETALLEVENTA,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            id_movimiento:
                                idMovimiento.id_valor_total
                        })
                    }
                );

            const data =
                await response.json();

            setResumenVenta(
                data.resumen
            );

            setDetalleVenta(
                data.productos
            );

        } catch (error) {

            console.error(error);

        }

    };

    if (!abierto)
        return null;

    return (

        <div className="modal-overlay">

            <div className="modal-deuda">

                <div className="modal-header">

                    <h2>
                        Detalle Venta
                    </h2>

                    <button
                        className="btn-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="modal-body">

                    {resumenVenta && (
                        <>

                            <div
                              className="cliente-info"
                            >

                                <strong>
                                    Cliente:
                                </strong>

                                {" "}

                                {
                                    idMovimiento.nombre_cliente
                                }

                            </div>

                            <div
                              className="resumen-grid"
                            >

                                <div
                                  className="resumen-card"
                                >

                                    <span>
                                      Total Venta
                                    </span>

                                    <strong>

                                        $
                                        {Number(idMovimiento.valor_total).toLocaleString("es-CO")}

                                    </strong>

                                </div>

                                <div
                                  className="resumen-card"
                                >

                                    <span>
                                      Valor Pagado
                                    </span>

                                    <strong>

                                        $
                                        {Number(resumenVenta.valor_pagado).toLocaleString("es-CO")}

                                    </strong>

                                </div>

                                <div
                                  className="resumen-card deuda"
                                >

                                    <span>
                                      Saldo Pendiente
                                    </span>

                                    <strong>

                                        $
                                        {Number(resumenVenta.cuenta_por_cobrar).toLocaleString("es-CO")}

                                    </strong>

                                </div>

                            </div>

                            <h3>
                                Productos
                            </h3>

                            <div
                              className="tabla-productos"
                            >

                                <table>

                                    <thead>

                                        <tr>

                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Total</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            detalleVenta.map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                <tr
                                                  key={index}
                                                >

                                                    <td>{item.nombre_producto}</td>
                                                    <td>{item.cantidad_movimiento}</td>
                                                    <td>
                                                        $
                                                        {Number(item.total).toLocaleString("es-CO")}
                                                    </td>

                                                </tr>
                                            ))
                                        }

                                    </tbody>

                                </table>

                            </div>

                        </>

                    )}

                </div>

                <div
                  className="modal-footer"
                >
                    <button
                        className="btn-cancelar"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>

                </div>

            </div>

        </div>

    );
}

export default DetalleVentaModal;