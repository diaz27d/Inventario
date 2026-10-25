import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ENDPOINTS } from "../config/api";

import "../../css/ClienteModal.css";

interface Props {
  abierto: boolean;
  cliente: any;
  onClose: () => void;
  cargarClientes: () => Promise<void>;
  desabilitar: boolean;
}

function EditarClienteModal({
  abierto,
  cliente,
  onClose,
  cargarClientes,
  desabilitar
}: Props) {

  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [estado, setEstado] = useState(true);

  const [errores, setErrores] = useState({
    nombre: "",
    documento: "",
    telefono: ""
  });

  useEffect(() => {

    if (abierto && cliente) {

      setNombre(
        cliente.nombre_cliente || ""
      );

      setDocumento(
        cliente.documento_cliente || ""
      );

      setTelefono(
        cliente.telefono_cliente || ""
      );

      setCorreo(
        cliente.correo_cliente || ""
      );

      setDireccion(
        cliente.direccion_cliente || ""
      );

      setEstado(
        cliente.estado_cliente === 1
      );

      setErrores({
        nombre: "",
        documento: "",
        telefono: ""
      });

    }

  }, [abierto, cliente]);

  if (!abierto) return null;

  const validarFormulario = () => {

    const nuevosErrores = {
      nombre: "",
      documento: "",
      telefono: ""
    };

    let valido = true;

    if (!nombre.trim()) {

      nuevosErrores.nombre =
        "Debe ingresar el nombre del cliente";

      valido = false;
    }

    if (!documento.trim()) {

      nuevosErrores.documento =
        "Debe ingresar el documento";

      valido = false;

    } else if (!/^\d+$/.test(documento)) {

      nuevosErrores.documento =
        "El documento solo debe contener números";

      valido = false;
    }

    if (!telefono.trim()) {

      nuevosErrores.telefono =
        "Debe ingresar el teléfono";

      valido = false;

    } else if (!/^\d+$/.test(telefono)) {

      nuevosErrores.telefono =
        "El teléfono solo debe contener números";

      valido = false;
    }

    setErrores(nuevosErrores);

    return valido;
  };

  const actualizarCliente = async () => {

    if (!validarFormulario()) {
      return;
    }

    try {

      const response = await fetch(
        ENDPOINTS.ACTUALIZARCLIENTE,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id_cliente:
              cliente.id_cliente,

            nombre_cliente: nombre,

            documento_cliente:
              documento,

            telefono_cliente:
              telefono,

            correo_cliente:
              correo,

            direccion_cliente:
              direccion,

            estado_cliente:
              estado ? 1 : 0
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message
        });

        return;
      }

      onClose();

      await cargarClientes();

      Swal.fire({
        icon: "success",
        title: "Cliente actualizado",
        text: data.message
      });

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "No fue posible actualizar el cliente"
      });
    }
  };

  return (

    <div className="modal-overlay">

      <div className="modal-cliente">

        <div className="modal-header">

          <h2>
            Editar Cliente
          </h2>

          <button
            className="btn-close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="modal-body">

          <div className="form-group">

            <label>
              Nombre Cliente *
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(
                  e.target.value
                )
              }
            />

            {errores.nombre && (
              <span className="error-text">
                {errores.nombre}
              </span>
            )}

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                Documento *
              </label>

              <input
                type="text"
                value={documento}
                maxLength={15}
                onChange={(e) =>
                  setDocumento(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 15)
                  )
                }
              />

              {errores.documento && (
                <span className="error-text">
                  {errores.documento}
                </span>
              )}

            </div>

            <div className="form-group">

              <label>
                Teléfono *
              </label>

              <input
                type="text"
                value={telefono}
                maxLength={10}
                onChange={(e) =>
                  setTelefono(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  )
                }
              />

              {errores.telefono && (
                <span className="error-text">
                  {errores.telefono}
                </span>
              )}

            </div>

          </div>

          <div className="form-group">

            <label>
              Correo
            </label>

            <input
              type="email"
              value={correo}
              onChange={(e) =>
                setCorreo(
                  e.target.value
                )
              }
            />

          </div>

          <div className="form-group">

            <label>
              Dirección
            </label>

            <textarea
              rows={3}
              value={direccion}
              onChange={(e) =>
                setDireccion(
                  e.target.value
                )
              }
            />

          </div>

          <div className="estado-container">

            <label className="switch">

              <input
                type="checkbox"
                checked={estado}
                onChange={(e) =>
                  setEstado(
                    e.target.checked
                  )
                }
              />

              <span className="slider"></span>

            </label>

            <span
              className={
                estado
                  ? "estado-activo"
                  : "estado-inactivo"
              }
            >
              {estado
                ? "Activo"
                : "Inactivo"}
            </span>

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
              actualizarCliente
            }
            disabled={desabilitar}
          >
            Guardar Cambios
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditarClienteModal;