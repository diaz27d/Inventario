import { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

import { ENDPOINTS } from "../config/api";

import "../../css/FacturaProveedorModal.css";

interface Props {
    abierto: boolean;
    onClose: () => void;
    cargarFacturas: () => Promise<void>;
}

interface OpcionSelect {
    value: number;
    label: string;
}

function NuevaFacturaProveedorModal({
    abierto,
    onClose,
    cargarFacturas
}: Props) {

    const [medioPago, setMedioPago] = useState<any[]>([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
    const [medioPagoSeleccionado, setMedioPagoSeleccionado] = useState<OpcionSelect | null>(null);
    const [numeroFactura, setNumeroFactura] = useState("");
    const [fechaFactura, setFechaFactura] = useState("");
    const [fechaVencimiento, setFechaVencimiento] = useState("");
    const [totalFactura, setTotalFactura] = useState(0);
    const [totalAbonado, setTotalAbonado] = useState(0);

    const cuentaPorPagar = totalFactura - totalAbonado;

    const guardarFactura =
        async () => {

        if(numeroFactura == ""){
             Swal.fire({
                    icon: 'warning',
                    title: 'Error al crear la factura',
                    text: 'Debe ingresar una factura',
                    confirmButtonColor: '#f59e0b'
                });
                return;
        }
        if(proveedorSeleccionado == ""){
             Swal.fire({
                    icon: 'warning',
                    title: 'Error al crear la factura',
                    text: 'Debe ingresar un proveedor',
                    confirmButtonColor: '#f59e0b'
                });
                return;
        }
        if(fechaFactura == ""){
             Swal.fire({
                    icon: 'warning',
                    title: 'Error al crear la factura',
                    text: 'Debe ingresar la fecha de la factura',
                    confirmButtonColor: '#f59e0b'
                });
                return;
        }
        if(totalFactura == 0){
             Swal.fire({
                    icon: 'warning',
                    title: 'Error al crear la factura',
                    text: 'Debe ingresar el total de la factura',
                    confirmButtonColor: '#f59e0b'
                });
                return;
        }
        if(fechaVencimiento == ""){
             Swal.fire({
                    icon: 'warning',
                    title: 'Error al crear la factura',
                    text: 'Debe ingresar la fecha de vencimiento',
                    confirmButtonColor: '#f59e0b'
                });
                return;
        }
        
        if(medioPagoSeleccionado == null ){
              Swal.fire({
                    icon: 'warning',
                    title: 'Error al crear la factura',
                    text: 'Debe seleccionar un medio de pago',
                    confirmButtonColor: '#f59e0b'
                });
                return;
        }

        try {

            const response =
                await fetch(
                    ENDPOINTS.GUARDARFACTURAPROVEEDOR,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            numero_factura:
                                numeroFactura,

                            fecha_factura:
                                 fechaFactura.replace(
                                        "T",
                                        " "
                                    ) + ":00",

                            nombre_proveedor:
                                proveedorSeleccionado,

                            total_factura:
                                totalFactura,

                            total_abonado:
                                totalAbonado,

                            cuenta_por_pagar:
                                cuentaPorPagar,
                            
                            estado_pago: 
                                cuentaPorPagar == 0 ? 1 : 0,

                            medioPago: 
                                medioPagoSeleccionado.value,

                            fecha_vencimiento:
                                fechaVencimiento.replace(
                                        "T",
                                        " "
                                    ) + ":00",

                        })

                    }
                );

            const data =
                await response.json();

            if (data.success) {
                
                setMedioPago([]);
                setProveedorSeleccionado("");
                setMedioPagoSeleccionado(null);
                setNumeroFactura("");
                setFechaFactura("");
                setFechaVencimiento("");
                setTotalFactura(0);
                setTotalAbonado(0);
                await cargarFacturas();

                onClose();

                Swal.fire({
                    icon: "success",
                    title: "Factura registrada",
                    text: data.message
                });

            }

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {
    const cargarMedioPago = async () => {
      try {


        const response = await fetch(
          ENDPOINTS.MEDIOSPAGOCOMBO,
          {
            method: "POST"
          }
        );

        const data = await response.json();

        setMedioPago( data ?? [] );

      } catch (error) {
        console.error(error);
      }
    }; 

    cargarMedioPago();

  }, []);

    const opcionesMediosPago =
        medioPago.map((mediopago) => ({
        value: mediopago.id_medio_pago,
        label: mediopago.medio_pago
        }));

    if (!abierto)
        return null;

    return (

        <div className="modal-overlay">

            <div className="modal-container">

                <div className="modal-header">

                    <h2>
                        Nueva Factura Proveedor
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
                                value={numeroFactura}
                                onChange={(e) =>
                                    setNumeroFactura(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Proveedor
                            </label>

                            <input
                                value={proveedorSeleccionado}
                                onChange={(e) =>
                                    setProveedorSeleccionado(
                                        e.target.value
                                    )
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
                                type="datetime-local"
                                value={fechaFactura}
                                onChange={(e) =>
                                    setFechaFactura(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Fecha Vencimiento
                            </label>

                            <input
                                type="datetime-local"
                                value={fechaVencimiento}
                                onChange={(e) =>
                                    setFechaVencimiento(
                                        e.target.value
                                    )
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
                                type="text"
                                value={
                                    totalFactura > 0
                                    ? totalFactura.toLocaleString("es-CO")
                                    : ""
                                }
                                onChange={(e) => {

                                    const valor =
                                        e.target.value.replace(/\D/g, "");

                                    setTotalFactura(
                                        valor
                                        ? Number(valor)
                                        : 0
                                    );

                                }}
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Total Abonado
                            </label>

                            <input
                                type="text"
                                value={
                                    totalAbonado.toLocaleString("es-CO")
                                }
                                onChange={(e) => {

                                    const valor =
                                        e.target.value.replace(/\D/g, "");

                                    setTotalAbonado(
                                        valor
                                        ? Number(valor)
                                        : 0
                                    );

                                }}
                            />

                        </div>

                    </div>

                    <div className="form-group-full">

                        <label>
                            Cuenta por Pagar
                        </label>

                        <input
                            value={ cuentaPorPagar.toLocaleString("es-CO")}
                            readOnly
                        />

                        <label>
                            Medio de Pago
                        </label>

                        <Select
                            className="venta-select"
                            classNamePrefix="venta-select"
                            placeholder="Seleccione pago..."
                            options={opcionesMediosPago}
                            isSearchable
                            value={medioPagoSeleccionado}
                            onChange={(opcion) =>
                                setMedioPagoSeleccionado(opcion)
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
                        onClick={guardarFactura}
                    >
                        Guardar Factura
                    </button>

                </div>

            </div>

        </div>

    );

}

export default NuevaFacturaProveedorModal;