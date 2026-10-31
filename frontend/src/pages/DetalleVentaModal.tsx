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

    const imprimirVenta = () => {

    const contenido = `
        <html>
        <head>
            <title>Detalle Venta</title>

            <style>

                body{
                    font-family: Arial, sans-serif;
                    padding:30px;
                }

                h1{
                    text-align:center;
                }

                table{
                    width:100%;
                    border-collapse:collapse;
                    margin-top:20px;
                }

                th,
                td{
                    border:1px solid #ddd;
                    padding:10px;
                    text-align:left;
                }

                th{
                    background:#f4f4f4;
                }

                .resumen{
                    display:flex;
                    justify-content:space-between;
                    margin:20px 0;
                }

                .card{
                    width:30%;
                    border:1px solid #ddd;
                    border-radius:8px;
                    padding:15px;
                    text-align:center;
                }

            </style>

        </head>

        <body>

            <h1>Detalle Venta</h1>

            <p>
                <strong>Fecha:</strong>
                ${idMovimiento.fecha_movimiento}
            </p>

            <p>
                <strong>Cliente:</strong>
                ${idMovimiento.nombre_cliente}
            </p>

            <div class="resumen">

                <div class="card">

                    <strong>Total Venta</strong>

                    <br/>

                    $${Number(
                        idMovimiento.valor_total
                    ).toLocaleString("es-CO")}

                </div>

                <div class="card">

                    <strong>Valor Pagado</strong>

                    <br/>

                    $${Number(
                        resumenVenta.valor_pagado
                    ).toLocaleString("es-CO")}

                </div>

                <div class="card">

                    <strong>Saldo Pendiente</strong>

                    <br/>

                    $${Number(
                        resumenVenta.cuenta_por_cobrar
                    ).toLocaleString("es-CO")}

                </div>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Producto</th>

                        <th>Cantidad</th>

                        <th>Total</th>

                    </tr>

                </thead>

                <tbody>

                    ${detalleVenta.map(item => `

                        <tr>

                            <td>${item.nombre_producto}</td>

                            <td>${item.cantidad_movimiento}</td>

                            <td>
                                $${Number(
                                    item.total
                                ).toLocaleString("es-CO")}
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </body>

        </html>
    `;

    const ventana =
        window.open(
            '',
            '_blank',
            'width=900,height=700'
        );

        if (ventana) {

            ventana.document.write(
                contenido
            );

            ventana.document.close();

            ventana.focus();

            ventana.print();

        }

    };

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
                                    Fecha Venta:
                                </strong>

                                {" "}

                                {
                                    idMovimiento.fecha_movimiento
                                }

                            </div>

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
                        className="btn-imprimir"
                        onClick={imprimirVenta}
                    >
                        Imprimir
                    </button>

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