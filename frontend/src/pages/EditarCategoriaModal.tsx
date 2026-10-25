import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ENDPOINTS } from "../config/api";

interface Props {
    abierto: boolean;
    categoria: any;
    onClose: () => void;
    cargarCategoriExistentes: () => Promise<void>;
    desabilitar: boolean;
}

function EditarCategoriaModal({
    abierto,
    categoria,
    onClose,
    cargarCategoriExistentes,
    desabilitar
}: Props) {

    const [nombreCategoria,
        setNombreCategoria] =
        useState("");

    const [error,
        setError] = useState("");

    useEffect(() => {

        if (
            abierto &&
            categoria
        ) {

            setNombreCategoria(
                categoria.nombre_categoria
            );

            setError("");
        }

    }, [abierto, categoria]);

    if (!abierto) return null;

    const actualizarCategoria =
        async () => {

        if (
            !nombreCategoria.trim()
        ) {

            setError(
              "Debe ingresar el nombre de la categoría"
            );

            return;
        }

        try {

            const response =
                await fetch(
                    ENDPOINTS.ACTUALIZARCATEGORIA,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            id_categoria:
                                categoria.id_categoria,

                            nombre_categoria:
                                nombreCategoria
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

            await cargarCategoriExistentes();

            Swal.fire({
                icon: "success",
                title:
                    "Categoría actualizada",
                text:
                    data.message
            });

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                  "No fue posible actualizar la categoría"
            });
        }
    };

    return (

        <div className="modal-overlay">

            <div className="modal-container-sm">

                <div className="modal-header">

                    <h2>
                        Editar Categoría
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
                            value={
                                nombreCategoria
                            }
                            placeholder="Ej. Motor"
                            onChange={(e) => {

                                setNombreCategoria(
                                    e.target.value
                                );

                                setError("");

                            }}
                        />

                        {error && (

                            <span
                              className="error-text"
                            >
                                {error}
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
                        onClick={
                            actualizarCategoria
                        }
                        disabled={desabilitar}
                    >
                        Guardar
                    </button>

                </div>

            </div>

        </div>
    );
}

export default EditarCategoriaModal;