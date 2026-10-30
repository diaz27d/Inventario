import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { ENDPOINTS } from "../config/api";

import "../../css/TrabajadorModal.css";

interface Props {
  abierto: boolean;
  onClose: () => void;
  cargarTrabajadores: () => Promise<void>;
}

function TrabajadorModal({
  abierto,
  onClose,
  cargarTrabajadores
}: Props) {

  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargo, setCargo] = useState("");
  const [errores, setErrores] = useState<any>({});

  useEffect(() => {

    if (abierto) {

      setNombre("");
      setDocumento("");
      setTelefono("");
      setCargo("");

      setErrores({});

    }

  }, [abierto]);

  if (!abierto) return null;

  const guardarTrabajador =
    async () => {

      const nuevosErrores: any = {};

      if (!nombre.trim()) {
        nuevosErrores.nombre =
          "Ingrese el nombre";
      }

      if (!documento.trim()) {
        nuevosErrores.documento =
          "Ingrese el documento";
      }

      if (!telefono.trim()) {
        nuevosErrores.telefono =
          "Ingrese el teléfono";
      }

      if (!cargo.trim()) {
        nuevosErrores.cargo =
          "Ingrese el cargo";
      }

      setErrores(
        nuevosErrores
      );

      if (
        Object.keys(
          nuevosErrores
        ).length > 0
      ) {
        console.log(errores);
        return;
      }

      try {

        const response =
          await fetch(
            ENDPOINTS.GUARDARTRABAJADOR,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({

                nombre_trabajador:
                  nombre,

                documento_trabajador:
                  documento,

                telefono_trabajador:
                  telefono,

                cargo_trabajador:
                  cargo

              })

            }
          );

        const data =
          await response.json();

        if (!data.success) {

          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message
          });

          return;

        }

        await cargarTrabajadores();

        onClose();

        Swal.fire({
          icon: "success",
          title: "Correcto",
          text: data.message
        });

      } catch (error) {

        console.error(error);

      }

    };

  return (

    <div className="modal-overlay">

      <div className="modal-trabajador">

        <div className="modal-header">

          <h2>
            Nuevo Trabajador
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
              Nombre *
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

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                Documento *
              </label>

              <input
                type="text"
                value={documento}
                onChange={(e) =>
                  setDocumento(
                    e.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                  )
                }
              />

            </div>

            <div className="form-group">

              <label>
                Teléfono *
              </label>

              <input
                type="text"
                value={telefono}
                onChange={(e) =>
                  setTelefono(
                    e.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                  )
                }
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Cargo *
            </label>

            <input
              type="text"
              value={cargo}
              onChange={(e) =>
                setCargo(
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
            onClick={
              guardarTrabajador
            }
          >
            Guardar
          </button>

        </div>

      </div>

    </div>

  );

}

export default TrabajadorModal;