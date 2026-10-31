import { useState } from "react";
import Swal from "sweetalert2";
import { ENDPOINTS } from "../config/api";
import "../../css/Login.css";

interface Props {
    abierto: boolean;
    onClose: () => void;

}

function RegistroUsuarioModal({
    abierto,
    onClose
}: Props) {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");

    if (!abierto)
        return null;

    const limpiarFormulario =
        () => {
        setNombre("");
        setCorreo("");
        setPassword("");
        setConfirmarPassword("");
    };

    const cerrarModal =
        () => {
        limpiarFormulario();
        onClose();

    };

    const registrarUsuario =
        async () => {

        if (!nombre.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Validación",
                text: "Debe ingresar el nombre"
            });

            return;

        }

        if (!correo.trim()) {

            Swal.fire({
                icon: "warning",
                title: "Validación",
                text: "Debe ingresar el correo"
            });
            return;
        }
        const correoValido = /^[^\s@]+@[^\s@]+\.com$/i;

        if (!correoValido.test(correo)) {
            Swal.fire({
                icon: "warning",
                title: "Correo inválido",
                text: "Ingrese un correo válido. Ejemplo: usuario@mail.com"
            });
            return;
        }

        if (!password.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Validación",
                text: "Debe ingresar la contraseña"
            });

            return;
        }
        
        if(password.length < 8){
            Swal.fire({
                icon: "warning",
                title: "Validación",
                text: "Debe ingresar una contraseña con minimo 8 dígitos"
            });
            return;
        }
        
        if (password !== confirmarPassword ) {

            Swal.fire({
                icon: "warning",
                title: "Validación",
                text: "Las contraseñas no coinciden"
            });

            return;

        }

        try {

            const response =
                await fetch(
                    ENDPOINTS.SIGNUP,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            fullName: nombre,
                            email: correo,
                            password,
                            passwordConfirmation: confirmarPassword
                        })

                    }
                );

            const data =
                await response.json();

            if (data.data) {

                Swal.fire({
                    icon: "success",
                    title: "Usuario Creado",
                    text: "Usuario Creado Correctamente"
                });

                cerrarModal();
            } 
            if(data.errors){
                
                Swal.fire({
                    icon: "error",
                    title: "Usuario no creado",
                    text: "Usuario no creado"
                });
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: String(error)
            });
        }
    };

    return (

        <div className="modal-overlay">

            <div className="modal-registro">

                <div className="modal-header">

                    <h2>
                        Registrar Usuario
                    </h2>

                    <button
                        className="btn-close"
                        onClick={cerrarModal}
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
                            type="text"
                            value={nombre}
                            onChange={(e) =>
                                setNombre(
                                    e.target.value
                                )
                            }
                            placeholder="Nombre completo"
                        />

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
                            placeholder="correo@ejemplo.com"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Contraseña
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="********"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Confirmar Contraseña
                        </label>

                        <input
                            type="password"
                            value={confirmarPassword}
                            onChange={(e) =>
                                setConfirmarPassword(
                                    e.target.value
                                )
                            }
                            placeholder="********"
                        />

                    </div>

                </div>

                <div className="modal-footer">

                    <button
                        className="btn-cancelar"
                        onClick={cerrarModal}
                    >
                        Cancelar
                    </button>

                    <button
                        className="btn-guardar"
                        onClick={registrarUsuario}
                    >
                        Registrarse
                    </button>

                </div>

            </div>

        </div>

    );

}

export default RegistroUsuarioModal;