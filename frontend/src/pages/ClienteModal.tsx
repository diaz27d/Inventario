import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ENDPOINTS } from "../config/api";

import "../../css/ClienteModal.css";

interface Props {
  abierto: boolean;
  onClose: () => void;
  cargarClientes: () => Promise<void>;
  desabilitar: boolean;
}

function ClienteModal({
  abierto,
  onClose,
  cargarClientes,
  desabilitar
}: Props) {

  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");

  const [errores, setErrores] = useState({
    nombre: "",
    documento: "",
    telefono: ""
  });

  useEffect(() => {

    if (abierto) {

      setNombre("");
      setDocumento("");
      setTelefono("");
      setCorreo("");
      setDireccion("");

      setErrores({
        nombre: "",
        documento: "",
        telefono: ""
      });

    }

  }, [abierto]);

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
    }

    if (!telefono.trim()) {

      nuevosErrores.telefono =
        "Debe ingresar el teléfono";

      valido = false;
    }

    setErrores(nuevosErrores);

    return valido;
  };

  const guardarCliente = async () => {

    if (!validarFormulario()) {
      return;
    }

    try {

      const response = await fetch(
        ENDPOINTS.GUARDARCLIENTES,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            nombre_cliente: nombre,
            documento_cliente: documento,
            telefono_cliente: telefono,
            correo_cliente: correo,
            direccion_cliente: direccion
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        Swal.fire({
            icon: 'error',
            title: 'Error al crear el cliente',
            text: data.message,
            confirmButtonColor: '#f59e0b'
            })

        return;
      }

      onClose();

      await cargarClientes();

      Swal.fire({
        icon: "success",
        title: "Cliente registrado",
        text: data.message
      });

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "No fue posible registrar el cliente"
      });
    }
  };

  return (

    <div className="modal-overlay">

      <div className="modal-cliente">

        <div className="modal-header">

          <h2>Nuevo Cliente</h2>

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
              placeholder="Ej. Juan Pérez"
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
                placeholder="Ej. 10852789"
                value={documento}
                onChange={(e) =>
                  setDocumento(
                    e.target.value.replace(/\D/g, "")
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
                placeholder="Ej. 3001234567"
                value={telefono}
                onChange={(e) =>
                  setTelefono(
                    e.target.value.replace(/\D/g, "")
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

          <div className="form-row">

            <div className="form-group">

              <label>
                Correo
              </label>

              <input
                type="email"
                placeholder="correo@correo.com"
                value={correo}
                onChange={(e) =>
                  setCorreo(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Dirección
            </label>

            <textarea
              rows={3}
              placeholder="Dirección del cliente"
              value={direccion}
              onChange={(e) =>
                setDireccion(
                  e.target.value
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
            onClick={guardarCliente}
            disabled={desabilitar}
          >
            Guardar
          </button>

        </div>

      </div>

    </div>
  );
}

export default ClienteModal;