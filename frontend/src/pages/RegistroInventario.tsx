
import "../../css/RegistroInventario.css";

import { useEffect, useState } from "react";
import Layout from "../layaouts/Layaout";
import Select from "react-select";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

interface OpcionSelect {
    value: number;
    label: string;
}

function RegistroInventario() {

  const user = JSON.parse(
    localStorage.getItem("user") ?? "{}"
  );

  const [productos, setProductos] = useState<any[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);

  const [detalle, setDetalle] = useState<any[]>([]);

  const [observacion, setObservacion] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<OpcionSelect | null>(null);
  const [medioPagoSeleccionado, setMedioPagoSeleccionado] = useState<OpcionSelect | null>(null);
  const [clientes, setClientes] = useState<any[]>([]);
  const [medioPago, setMedioPago] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [valorPagado, setValorPagado] = useState(0);
  

  const totalMovimiento = detalle.reduce(
    (total, item) =>
      total +
      (
        Number(item.precio_producto) *
        Number(item.cantidad)
      ),
    0
  );

  const saldoPendiente = totalMovimiento - valorPagado

  useEffect(() => {
    const cargarClientes = async () => {
      try {

        setLoading(true);

        const response = await fetch(
          ENDPOINTS.CLIENTECOMBO,
          {
            method: "POST"
          }
        );

        const data = await response.json();

        setClientes( data ?? [] );

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }; 

    cargarClientes();

  }, []);


  useEffect(() => {
    const cargarMedioPago = async () => {
      try {

        setLoading(true);

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
      } finally {
        setLoading(false);
      }
    }; 

    cargarMedioPago();

  }, []);


  useEffect(() => {

    const cargarProductos = async () => {

      try {

        const response = await fetch(
          ENDPOINTS.PRODUCTOSCOMBOS,
          {
            method: "POST"
          }
        );

        const data = await response.json();

        setProductos(data ?? []);

      } catch (error) {

        console.error(error);

      }
    };

    cargarProductos();

  }, []);

  const agregarProducto = () => {

    if (!productoSeleccionado) {
      return;
    }

    const existe = detalle.find(
      item =>
        item.id_producto ===
        productoSeleccionado.value
    );

    if (existe) {
      return;
    }

    setDetalle([
      ...detalle,
      {
        id_producto:
          productoSeleccionado.value,

        nombre_producto:
          productoSeleccionado.label,
        
        precio_producto: 
          productoSeleccionado.precio,

        cantidad: 1
      }
    ]);
  };

  const eliminarProducto = (
    idProducto: number
  ) => {

    setDetalle(
      detalle.filter(
        item =>
          item.id_producto !== idProducto
      )
    );

  };

  const actualizarCantidad = (
    index: number,
    valor: string
  ) => {

    const copia = [...detalle];

    copia[index].cantidad =
      Number(valor);

    setDetalle(copia);
  };

  const registrarMovimiento = async () => {

    if (detalle.length === 0) {

      Swal.fire({
          icon: 'warning',
          title: 'Error al crear registro de inventario',
          text: "Debe agregar al menos un producto",
          confirmButtonColor: '#f59e0b'
      })

      return;
    }

    if(observacion === ''){
      Swal.fire({
          icon: 'warning',
          title: 'Error al crear registro de inventario',
          text: "Debe agregar una observación",
          confirmButtonColor: '#f59e0b'
      })

      return;
    }

    if(clienteSeleccionado == null){
      Swal.fire({
          icon: 'warning',
          title: 'Error al crear registro de inventario',
          text: "Debe agregar una cliente",
          confirmButtonColor: '#f59e0b'
      })

      return;
    }
    
    if(medioPagoSeleccionado == null){
      Swal.fire({
          icon: 'warning',
          title: 'Error al crear registro de inventario',
          text: "Debe agregar un medio de pago",
          confirmButtonColor: '#f59e0b'
      })

      return;
    }
    

    try {

      const response = await fetch(
        ENDPOINTS.GUARDARINVENTARIO,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            observacion,
            totalMovimiento,
            productos: detalle,
            usuario: user.email,
            id_cliente: clienteSeleccionado.value,
            valor_pagado: valorPagado,
            cuenta_por_cobrar: saldoPendiente
          })
        }
      );

      const data = await response.json();

      if(data.success){
        setDetalle([]);
        setObservacion("");
        setProductoSeleccionado(null);
        setClienteSeleccionado(null);
        setMedioPagoSeleccionado(null);
        setValorPagado(0);

        Swal.fire({
          icon: 'success',
          title: 'Producto registrado',
          text: data.message
        })
        
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'Error al crear el producto',
          text: data.message,
          confirmButtonColor: '#f59e0b'
        })
      }

    } catch (error) {

      Swal.fire({
          icon: 'warning',
          title: 'Error al crear el producto',
          text: String(error),
          confirmButtonColor: '#f59e0b'
      })

    }
  };

  const opcionesProductos =
    productos.map((producto) => ({
      value: producto.id_producto,
      label: producto.nombre_producto,
      precio: producto.precio_producto
    }));

  const opcionesClientes =
    clientes.map((cliente) => ({
      value: cliente.id_cliente,
      label: cliente.nombre_cliente
    }));

  const opcionesMediosPago =
    medioPago.map((mediopago) => ({
      value: mediopago.id_medio_pago,
      label: mediopago.medio_pago
    }));

  return (

    <Layout>

      <div className="registro-page">

        <div className="card-registro">

          <h2>
            Registro de Venta
          </h2>

          <div className="form-group">

            <label>
              Buscar Producto
            </label>

              <div className="producto-selector">

                <div className="producto-select-container">

                    <Select
                        className="producto-select"
                        classNamePrefix="producto-select"
                        placeholder="Buscar producto..."
                        options={opcionesProductos}
                        isSearchable
                        onChange={(opcion) =>
                            setProductoSeleccionado(opcion)
                        }
                    />

                </div>

                <button
                    className="btn-agregar-producto"
                    onClick={agregarProducto}
                >
                    <FaPlus />
                </button>

            </div>

            </div>

          </div>

           {loading ? (

            <div className="loading-container">

            <div className="spinner"></div>

            <p>Cargando productos...</p>

            </div>

            ) : (

            <div className="tabla-detalle">

              <table>

                <thead>

                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Valor Unitario</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>

                </thead>

                <tbody>
                  {detalle.map(
                    (item, index) => (

                    <tr
                      key={
                        item.id_producto
                      }
                    >

                      <td>
                        {
                          item.nombre_producto
                        }
                      </td>

                      <td>

                        <input
                          className="input-cantidad"
                          type="number" 
                          min="1"
                          value={
                            item.cantidad
                          }
                          onChange={(e) =>
                            actualizarCantidad(
                              index,
                              e.target.value
                            )
                          }
                        />

                      </td>

                      <td>
                        {Number(
                          item.precio_producto
                        ).toLocaleString('es-CO')}
                      </td>

                      <td>
                        {(
                          Number(item.precio_producto) *
                          Number(item.cantidad)
                        ).toLocaleString("es-CO")}
                      </td>

                      <td>

                        <button
                          className="btn-eliminar"
                          onClick={() =>
                            eliminarProducto(
                              item.id_producto
                            )
                          }
                        >
                          <FaTrash />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

              <div className="total-container">
                <span>
                  Total Movimiento
                </span>

                <strong>
                  $
                  {totalMovimiento.toLocaleString(
                    "es-CO"
                  )}
                </strong>

              </div>

            </div>
          )
            }

          <div className="form-group">

            <label>
              Observación
            </label>

            <textarea
              rows={4}
              placeholder="Observación del movimiento..."
              value={observacion}
              onChange={(e) =>
                setObservacion(
                  e.target.value
                )
              }
            />

          </div>

          <div className="form-group-full" style={{ display: "none" }}>
            <label>Email</label>
            <input
              type="text"
              placeholder="Ej. Aceite"
              value={user}
            />
          </div>

          <div className="venta-selectores">

          <div className="form-group">

              <label>
                  Cliente
              </label>

              <Select
                  className="venta-select"
                  classNamePrefix="venta-select"
                  placeholder="Seleccionar cliente..."
                  options={opcionesClientes}
                  isSearchable
                  value={clienteSeleccionado}
                  onChange={(opcion) =>
                      setClienteSeleccionado(opcion)
                  }
              />

          </div>

          <div className="form-group">

              <label>
                  Medio de Pago
              </label>

              <Select
                  className="venta-select"
                  classNamePrefix="venta-select"
                  placeholder="Seleccionar medio de pago..."
                  options={opcionesMediosPago}
                  isSearchable
                  value={medioPagoSeleccionado}
                  onChange={(opcion) =>
                      setMedioPagoSeleccionado(opcion)
                  }
              />

          </div>

          <div className="valores-venta">

            <div className="form-group">

                <label>
                    Valor Pagado
                </label>

                <input
                    type="text"
                    className="input-cuenta-cobrar"
                    value={
                        valorPagado > 0
                            ? valorPagado.toLocaleString("es-CO")
                            : ""
                    }
                    onChange={(e) => {

                        const valor =
                            e.target.value.replace(/\D/g, "");

                        setValorPagado(
                            valor
                                ? Number(valor)
                                : 0
                        );

                    }}
                    placeholder="0"
                />

            </div>

            <div className="form-group">

                <label>
                    Cuenta por Cobrar
                </label>

                <input
                    type="text"
                    className="input-cuenta-cobrar"
                    value={saldoPendiente.toLocaleString("es-CO")}
                    readOnly
                />

            </div>

        </div>

      </div>

          <button
            className="btn-movimiento"
            onClick={
              registrarMovimiento
            }
          >
            <FaSave />
            Registrar Venta
          </button>
        </div>
    </Layout>

  );
}

export default RegistroInventario;