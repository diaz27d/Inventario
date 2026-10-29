import {
  useEffect,
  useState
} from "react";

import Swal from "sweetalert2";

import { ENDPOINTS } from "../config/api";

import "../../css/TrabajadorModal.css";

interface Props {
  abierto: boolean;
  trabajador: any;
  onClose: () => void;
  cargarTrabajadores: () => Promise<void>;
}

function EditarTrabajadorModal({
  abierto,
  trabajador,
  onClose,
  cargarTrabajadores
}: Props) {

  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargo, setCargo] = useState("");
  const [estado, setEstado] = useState(true);
  const [valorPagarTrabajador, setvalorPagarTrabajador] = useState(0);
  const [valorPagado, setvalorPagado] = useState(0);
  

  useEffect(() => {

    if (
      abierto &&
      trabajador
    ) {

      setNombre(
        trabajador.nombre_trabajador
      );

      setDocumento(
        trabajador.documento_trabajador
      );

      setTelefono(
        trabajador.telefono_trabajador
      );

      setCargo(
        trabajador.cargo_trabajador
      );

      setEstado(
        trabajador.estado_trabajador === 1
      );

      setvalorPagarTrabajador(
        trabajador.valor_pagar_trabajador
        );

    }

  }, [
    abierto,
    trabajador
  ]);

  if (!abierto)
    return null;

  const actualizarTrabajador =
    async () => {

      if(valorPagarTrabajador < valorPagado){
        Swal.fire({
            icon: "error",
            title: "Error",
            text:
              "El valor abono a pagar al trabajador no debe ser mayor al valor pendiente de pagar al trabajador"
        });
        return;
      }

      try {

        const response =
          await fetch(
            ENDPOINTS.ACTUALIZARTRABAJADOR,
            {

              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({

                id_trabajador:
                  trabajador.id_trabajador,

                nombre_trabajador:
                  nombre,

                documento_trabajador:
                  documento,

                telefono_trabajador:
                  telefono,

                cargo_trabajador:
                  cargo,

                estado_trabajador:
                  estado ? 1 : 0,
                
                valorPagado: valorPagado

              })

            }
          );

        const data =
          await response.json();

        if (
          data.success
        ) {

          await cargarTrabajadores();

          onClose();

          Swal.fire({
            icon: "success",
            title: "Correcto",
            text: data.message
          });

        }

      } catch (error) {

        console.error(error);

      }

    };

  return (

    <div className="modal-overlay">

      <div className="modal-trabajador">

        <div className="modal-header">

          <h2>
            Editar Trabajador
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
              Nombre
            </label>

            <input
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
                Documento
              </label>

              <input
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
                Teléfono
              </label>

              <input
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
              Cargo
            </label>

            <input
              value={cargo}
              onChange={(e) =>
                setCargo(
                  e.target.value
                )
              }
            />

          </div>

        <div className="form-row">
            <div className="form-group">

            <label>
              Valor pendiente de pagar al trabajador
            </label>

            <input disabled
              value={valorPagarTrabajador}
            />

            <label>
              Abono a pagar al trabajador 
            </label>

            <input
              value={valorPagado}
              onChange={(e) =>
                setvalorPagado(
                  Number(e.target.value)
                )
              }
            />

          </div>

        </div>

        <div className="row">

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

                <span className="estado-label">

                    {
                        estado
                            ? "Activo"
                            : "Inactivo"
                    }

                </span>

            </div>            

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
              actualizarTrabajador
            }
          >
            Guardar Cambios
          </button>

        </div>

      </div>

    </div>

  );

}

export default EditarTrabajadorModal;