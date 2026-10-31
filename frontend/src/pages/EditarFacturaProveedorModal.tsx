import { useEffect, useState } from "react";

import Select from "react-select";
import Swal from "sweetalert2";

import { ENDPOINTS } from "../config/api";

import "../../css/FacturaProveedorModal.css";

interface Props {

    abierto: boolean;

    factura: any;

    onClose: () => void;

    cargarFacturas: () => Promise<void>;

}

function EditarFacturaProveedorModal({
    abierto,
    factura,
    onClose,
    cargarFacturas
}: Props) {

    const [totalAbonado, setTotalAbonado] = useState(0);
    const [medioPagoSeleccionado, setMedioPagoSeleccionado] = useState<any>(null);
    const [mediosPago, setMediosPago] = useState<any[]>([]);

    useEffect(() => {

        if ( abierto && factura ) {

            setTotalAbonado(
                Number(
                    factura.total_abonado || 0
                )
            );

            cargarMediosPago();

        }

    }, [
        abierto,
        factura
    ]);

    const cargarMediosPago =
        async () => {

        try {

            const response =
                await fetch(
                    ENDPOINTS.MEDIOSPAGOCOMBO,
                    {
                        method: "POST"
                    }
                );

            const data =
                await response.json();

            setMediosPago(
                data ?? []
            );

            const medioActual =
                data.find(
                    (item: any) =>

                        item.id_medio_pago ===
                        factura.id_medio_pago
                );

            if (medioActual) {

                setMedioPagoSeleccionado({

                    value:
                        medioActual.id_medio_pago,

                    label:
                        medioActual.medio_pago

                });

            }

        } catch (error) {

            console.error(error);

        }

    };

    if (
        !abierto ||
        !factura
    ) return null;

    const cuentaPorPagar =

        Number(factura.total_factura)
        -
        Number( totalAbonado);

    const guardarCambios =
        async () => {

        try {

            if(medioPagoSeleccionado == null ){
                Swal.fire({
                    icon: 'warning',
                    title: 'Error al actualizar la factura',
                    text: 'Debe seleccionar un medio de pago',
                    confirmButtonColor: '#f59e0b'
                });
                return;
            }
            if(factura.total_factura < totalAbonado){
                Swal.fire({
                    icon: 'warning',
                    title: 'Error al actualizar la factura',
                    text: 'El abono no debe ser mayor al total de la factura',
                    confirmButtonColor: '#f59e0b'
                });
                return;
            }

            const response =
                await fetch(

                    ENDPOINTS.ACTUALIZARFACTURAPROVEEDOR,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify({

                                id_factura_proveedor:
                                    factura.id_factura_proveedor,

                                total_abonado:
                                    totalAbonado,

                                cuenta_por_pagar:
                                    cuentaPorPagar,

                                id_medio_pago:
                                    medioPagoSeleccionado?.value,

                                estado_pago:
                                    cuentaPorPagar > 0
                                        ? 0
                                        : 1

                            })

                    }

                );

            const data =
                await response.json();

            if (data.success) {
                setMedioPagoSeleccionado(null);
                setTotalAbonado(0);

                await cargarFacturas();

                 window.dispatchEvent(
                    new Event(
                        "actualizarNotificaciones"
                    )
                );

                onClose();

                Swal.fire({
                    icon: "success",
                    title: "Factura Actualizada",
                    text: data.message

                });

            } else {

                Swal.fire({
                    icon: "warning",
                    title: "Error",
                    text: data.message
                });

            }

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="modal-container">

                <div className="modal-header">

                    <h2>
                        Editar Factura Proveedor
                    </h2>

                    <button
                        className="btn-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="modal-body">

                    <div className="row">

                        <div className="form-group">

                            <label>
                                Número Factura
                            </label>

                            <input
                                disabled
                                value={
                                    factura.numero_factura
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Proveedor
                            </label>

                            <input
                                disabled
                                value={
                                    factura.nombre_proveedor
                                }
                            />

                        </div>

                    </div>

                    <div className="row">

                        <div className="form-group">

                            <label>
                                Fecha Factura
                            </label>

                            <input
                                disabled
                                value={
                                    factura.fecha_factura
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Fecha Vencimiento
                            </label>

                            <input
                                disabled
                                value={
                                    factura.fecha_vecimiento
                                }
                            />

                        </div>

                    </div>

                    <div className="row">

                        <div className="form-group">

                            <label>
                                Total Factura
                            </label>

                            <input
                                disabled
                                value={
                                    Number(
                                        factura.total_factura
                                    ).toLocaleString("es-CO")
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Total Abonado
                            </label>

                            <input

                                type="text"

                                value={totalAbonado.toLocaleString("es-CO")}

                                onChange={(e) => {

                                    const valor =
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        );

                                    setTotalAbonado(

                                        valor

                                        ? Number(valor)

                                        : 0

                                    );

                                }}

                            />

                        </div>

                    </div>

                    <div
                        className="form-group-full"
                    >

                        <label>
                            Cuenta por Pagar
                        </label>

                        <input

                            disabled

                            value={
                                cuentaPorPagar.toLocaleString(
                                    "es-CO"
                                )
                            }

                        />

                    </div>

                    <div
                        className="form-group-full"
                    >

                        <label>
                            Medio de Pago
                        </label>

                        <Select

                            value={
                                medioPagoSeleccionado
                            }

                            options={
                                mediosPago.map(
                                    medio => ({

                                        value:
                                            medio.id_medio_pago,

                                        label:
                                            medio.medio_pago

                                    })
                                )
                            }

                            onChange={(opcion) =>
                                setMedioPagoSeleccionado(
                                    opcion
                                )
                            }

                        />

                    </div>

                </div>

                <div className="modal-footer">

                    <button
                        className="btn-cancelar"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="btn-guardar"
                        onClick={
                            guardarCambios
                        }
                    >
                        Guardar Cambios
                    </button>

                </div>

            </div>

        </div>

    );

}

export default EditarFacturaProveedorModal;