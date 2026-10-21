import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ENDPOINTS } from "../config/api";

interface Props {
    abierto: boolean;
    marca: any;
    onClose: () => void;
    cargarMarcasExistentes: () => Promise<void>;
}

function EditarMarcaModal({
    abierto,
    marca,
    onClose,
    cargarMarcasExistentes
}: Props) {

    const [nombreMarca, setNombreMarca] =
        useState("");

    const [error, setError] =
        useState("");

    useEffect(() => {

        if (
            abierto &&
            marca
        ) {

            setNombreMarca(
                marca.nombre_marca
            );

            setError("");
        }

    }, [abierto, marca]);

    if (!abierto) return null;

    const actualizarMarca = async () => {

        if (!nombreMarca.trim()) {

            setError(
                "Debe ingresar el nombre de la marca"
            );

            return;
        }

        try {

            const response =
                await fetch(
                    ENDPOINTS.ACTUALIZARMARCA,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            id_marca:
                                marca.id_marca,
                            nombre_marca:
                                nombreMarca
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

            await cargarMarcasExistentes();

            Swal.fire({
                icon: "success",
                title: "Marca actualizada",
                text: data.message
            });

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    "No fue posible actualizar la marca"
            });
        }
    };

    return (

        <div className="modal-overlay">

            <div className="modal-container-sm">

                <div className="modal-header">

                    <h2>
                        Editar Marca
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
                            Nombre Marca *
                        </label>

                        <input
                            type="text"
                            value={nombreMarca}
                            placeholder="Ej. Yamaha"
                            onChange={(e) => {

                                setNombreMarca(
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
                            actualizarMarca
                        }
                    >
                        Guardar
                    </button>

                </div>

            </div>

        </div>
    );
}

export default EditarMarcaModal;