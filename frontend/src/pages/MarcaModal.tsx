import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ENDPOINTS } from '../config/api'

import "../../css/MarcaModal.css";

interface Props {
  abierto: boolean;
  onClose: () => void;
  cargarMarcasExistentes: () => Promise<void>;
  desabilitar: boolean;
}

function MarcaModal({
  abierto,
  onClose,
  cargarMarcasExistentes,
  desabilitar,
}: Props) {

  const [nombreMarca, setNombreMarca] = useState("");

  const [errores, setErrores] = useState({
    nombreMarca: ""
  });

  useEffect(() => {

    if (abierto) {

      setNombreMarca("");

      setErrores({
        nombreMarca: ""
      });

    }

  }, [abierto]);

  if (!abierto) return null;

  const validar = () => {

    const nuevosErrores = {
      nombreMarca: ""
    };

    let valido = true;

    if (!nombreMarca.trim()) {

      nuevosErrores.nombreMarca =
        "Debe ingresar el nombre de la marca";

      valido = false;
    }

    setErrores(nuevosErrores);

    return valido;
  };

  const guardarMarca = async () => {

    if (!validar()) return;

    try {

      const response = await fetch(
        ENDPOINTS.GUARDARMARCA,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre_marca: nombreMarca
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message
        });

        return;
      }

      onClose();

      await cargarMarcasExistentes();

      Swal.fire({
        icon: "success",
        title: "Marca registrada",
        text: data.message
      });

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible guardar la marca"
      });
    }
  };

  return (

    <div className="modal-overlay">

      <div className="modal-container-sm">

        <div className="modal-header">

          <h2>Nueva Marca</h2>

          <button
            className="btn-close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="modal-body">

          <div className="form-group-full">

            <label>
              Nombre Marca *
            </label>

            <input
              type="text"
              value={nombreMarca}
              placeholder="Ej. Yamaha"
              onChange={(e) =>
                setNombreMarca(
                  e.target.value
                )
              }
              className={
                errores.nombreMarca
                  ? "input-error"
                  : ""
              }
            />

            {errores.nombreMarca && (

              <span className="error-text">
                {errores.nombreMarca}
              </span>

            )}

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
            onClick={guardarMarca}
            disabled={desabilitar}
          >
            Guardar
          </button>

        </div>

      </div>

    </div>

  );
}

export default MarcaModal;