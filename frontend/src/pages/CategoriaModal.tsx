import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ENDPOINTS } from "../config/api";


import "../../css/CategoriasModal.css";

interface Props {
  abierto: boolean;
  onClose: () => void;
  cargarCategoriExistentes: () => Promise<void>;
  desabilitar: boolean;
}

function CategoriaModal({
  abierto,
  onClose,
  cargarCategoriExistentes,
  desabilitar
}: Props) {

  const [nombreCategoria, setNombreCategoria] =
    useState("");

  const [errores, setErrores] = useState({
    nombreCategoria: ""
  });

  useEffect(() => {

    if (abierto) {

      setNombreCategoria("");

      setErrores({
        nombreCategoria: ""
      });

    }

  }, [abierto]);

  if (!abierto) return null;

  const validar = () => {

    const nuevosErrores = {
      nombreCategoria: ""
    };

    let valido = true;

    if (!nombreCategoria.trim()) {

      nuevosErrores.nombreCategoria =
        "Debe ingresar el nombre de la categoría";

      valido = false;
    }

    setErrores(nuevosErrores);

    return valido;
  };

  const guardarCategoria = async () => {

    if (!validar()) return;

    try {

      const response = await fetch(
        ENDPOINTS.GUARDARCATEGORIAS,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre_categoria:
              nombreCategoria
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

      await cargarCategoriExistentes();

      Swal.fire({
        icon: "success",
        title: "Categoría registrada",
        text: data.message
      });

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible guardar la categoría"
      });

    }
  };

  return (

    <div className="modal-overlay">

      <div className="modal-container-sm">

        <div className="modal-header">

          <h2>
            Nueva Categoría
          </h2>

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
              Nombre Categoría *
            </label>

            <input
              type="text"
              value={nombreCategoria}
              placeholder="Ej. Llantas"
              onChange={(e) =>
                setNombreCategoria(
                  e.target.value
                )
              }
              className={
                errores.nombreCategoria
                  ? "input-error"
                  : ""
              }
            />

            {errores.nombreCategoria && (

              <span className="error-text">
                {errores.nombreCategoria}
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
            onClick={guardarCategoria}
            disabled={desabilitar}
          >
            Guardar
          </button>

        </div>

      </div>

    </div>

  );
}

export default CategoriaModal;