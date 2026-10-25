import { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

import { ENDPOINTS } from "../config/api";

import "../../css/DetalleDeudaModal.css";

interface Props {
    abierto: boolean;
    cliente: any;
    onClose: () => void;
    recargarDeudas: () => Promise<void>;
    desabilitar: boolean;
}

function DetalleDeudaModal({
    abierto,
    cliente,
    onClose,
    recargarDeudas,
    desabilitar
}: Props) {

    const [ventas, setVentas] = useState<any[]>([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);
    const [detalleVenta, setDetalleVenta] = useState<any[]>([]);
    const [resumenVenta, setResumenVenta] = useState<any>(null);
    const [abono, setAbono] = useState("");

    useEffect(() => {

        if (
            abierto &&
            cliente
        ) {

            cargarVentasPendientes();

        }

    }, [abierto, cliente]);

    const cargarVentasPendientes =
        async () => {

        try {

            const response =
                await fetch(
                    ENDPOINTS.VENTASPENDIENTESCLIENTE,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            id_cliente:
                                cliente.id_cliente
                        })
                    }
                );

            const data =
                await response.json();

            setVentas(
                data ?? []
            );

        } catch (error) {

            console.error(error);

        }

    };

    const cargarDetalleVenta =
        async (
            idMovimiento: number
        ) => {

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
                                idMovimiento
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

    const registrarAbono =
        async () => {

        if (!ventaSeleccionada) {

            Swal.fire({
                icon: "warning",
                title: "Error",
                text:
                    "Seleccione una venta"
            });

            return;
        }
        const valorAbono =
            Number(
            abono.replace(/\./g, "")
        );

        debugger;
        if(valorAbono == 0){
            Swal.fire({
                icon: "warning",
                title: "Error",
                text: "El abono debe ser mayor a cero"
            });

            return;
        }

        if(valorAbono > Number(resumenVenta?.cuenta_por_cobrar || 0 )){
            Swal.fire({
                icon: "warning",
                title: "Error",
                text: "El abono no puede ser mayor a la cuenta por cobrar"
            });

            return;
        }

        try {

            const response =
                await fetch(
                    ENDPOINTS.REGISTRARABONO,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            id_movimiento:
                                ventaSeleccionada.value,

                            abono: valorAbono
                        })
                    }
                );

            const data =
                await response.json();

            if (data.success) {
                setAbono("");
                setResumenVenta(null);
                setDetalleVenta([]);
                setVentaSeleccionada(null);
                setVentas([]);
                await recargarDeudas();

                Swal.fire({
                    icon: "success",
                    title: "Abono registrado",
                    text:
                        data.message
                });

                onClose();

            }

        } catch (error) {

            console.error(error);

        }

    };

    if (!abierto)
        return null;

    const cerrarModal = () => {
        setAbono("");
        setResumenVenta(null);
        setDetalleVenta([]);
        setVentaSeleccionada(null);
        setVentas([]);
        onClose();
        recargarDeudas();
    };

    return (

        <div className="modal-overlay">

            <div className="modal-deuda">

                <div className="modal-header">

                    <h2>
                        Deuda Cliente
                    </h2>

                    <button
                        className="btn-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="modal-body">

                    <div className="cliente-info">

                        <strong>
                            Cliente:
                        </strong> { cliente?.nombre_cliente }

                    </div>

                    <div
                      className="form-group"
                    >

                        <label>
                            Venta Pendiente
                        </label>

                        <Select
                            placeholder="Seleccione una venta"
                            options={
                                ventas.map(
                                    venta => ({
                                        value:
                                            venta.id_valor_total,
                                        label:
                                            `Venta #${venta.id_valor_total} - ${venta.fecha_movimiento}`
                                    })
                                )
                            }
                            value={
                                ventaSeleccionada
                            }
                            onChange={(
                                opcion
                                ) => {
                                    setVentaSeleccionada(
                                        opcion
                                    );
                                    cargarDetalleVenta(
                                        opcion?.value
                                    );
                                }}
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                })
                            }}
                        />

                    </div>

                    {resumenVenta && (

                        <>
                            <div className="resumen-grid">

                                <div className="resumen-card" >

                                    <span>
                                        Total Venta
                                    </span>

                                    <strong>
                                      $
                                      {Number( resumenVenta.valor_total ).toLocaleString( "es-CO" )}

                                    </strong>

                                </div>

                                <div className="resumen-card" >

                                    <span>
                                        Valor Pagado
                                    </span>

                                    <strong>
                                      $
                                      {Number( resumenVenta.valor_pagado ).toLocaleString( "es-CO" )}

                                    </strong>

                                </div>

                                <div className="resumen-card deuda" >

                                    <span>
                                        Saldo Pendiente
                                    </span>

                                    <strong>
                                      $
                                      {Number( resumenVenta.cuenta_por_cobrar).toLocaleString("es-CO")}

                                    </strong>

                                </div>

                            </div>

                            <h3>
                                Productos
                            </h3>

                            <div className="tabla-productos" >

                                <table>

                                    <thead>

                                        <tr>

                                            <th> Producto </th>
                                            <th> Cantidad </th>
                                            <th> Total </th>

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
                                                  key={
                                                    index
                                                  }
                                                >

                                                    <td>{ item.nombre_producto } </td>
                                                    <td>{ item.cantidad_movimiento }
                                                    </td>

                                                    <td>
                                                        $
                                                        {Number( item.total ).toLocaleString( "es-CO")}

                                                    </td>

                                                </tr>

                                            ))
                                        }

                                    </tbody>

                                </table>

                            </div>

                            <div
                              className="form-group"
                            >

                                <label>
                                    Registrar Abono
                                </label>

                                <input
                                    type="text"
                                    value={abono}
                                    placeholder="0"
                                    onChange={(e) => {

                                        const valor =
                                            e.target.value.replace(/\D/g, "");

                                        setAbono(
                                            valor
                                                ? Number(valor)
                                                    .toLocaleString("es-CO")
                                                : ""
                                        );

                                    }}
                                />

                            </div>

                        </>

                    )}

                </div>

                <div className="modal-footer">

                    <button
                        className="btn-cancelar"
                        onClick={cerrarModal}
                    >
                        Cancelar
                    </button>

                    <button
                        className="btn-guardar"
                        onClick={
                            registrarAbono
                        }
                        disabled={desabilitar}
                    >
                        Registrar Abono
                    </button>

                </div>

            </div>

        </div>

    );

}

export default DetalleDeudaModal;