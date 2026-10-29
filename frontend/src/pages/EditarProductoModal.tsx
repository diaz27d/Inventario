import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ENDPOINTS } from '../config/api'
import "../../css/EditarProductoModal.css";

interface Props {
  abierto: boolean;
  onClose: () => void;
  producto: any;
  categorias: any[];
  marcas: any[];
  cargarProductos: () => Promise<void>;
  desabilitar: boolean;
}

function EditarProductoModal({
  abierto,
  onClose,
  producto,
  categorias,
  marcas,
  cargarProductos,
  desabilitar
}: Props) {

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState(0);
  const [precioAdquirido, setPrecioAdquirido] = useState(0);
  const [stock, setStock] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [IdProducto, setIdProducto] = useState(0);
  const [estado, setEstado] = useState(true);
  const [precioVariable, setprecioVariable] = useState(true);

  const [errores, setErrores] = useState({
    precio: "",
    precio_adquirido: "",
    stock: "",
    descripcion: ""
  });

  useEffect(() => {

    if (!producto) return;
    debugger;

    setIdProducto(producto.id_producto || 0);

    setNombre(producto.nombre_producto || "");
    setCategoria(
      String(producto.id_categoria || "")
    );
    setMarca(
      String(producto.id_marca || "")
    );
    setPrecio(
      Number(producto.precio_producto || 0)
    );
    setPrecioAdquirido(
      Number(producto.precio_adquirido_producto || 0)
    );
    setStock(
      Number(producto.cantidad_producto || 0)
    );
    setDescripcion(
      String(producto.descripcion_producto || "")
    );

    setEstado(
      producto.estado_producto === 1 ||
      producto.estado_producto === true
    );

    setprecioVariable(
      producto.precio_variable === 1 ||
      producto.precio_variable === true
    );

  }, [producto]);

  if (!abierto) return null;

  const validarFormulario = () => {

    const nuevosErrores = {
      precio: "",
      precio_adquirido: "",
      stock: "",
      descripcion: ""
    };

    let valido = true;


    if (!precio || Number(precio) <= 0) {
      nuevosErrores.precio =
        "El precio debe ser mayor a cero";
      valido = false;
    }

    if (!precioAdquirido || Number(precioAdquirido) <= 0) {
      nuevosErrores.precio_adquirido =
        "El precio adquirido debe ser mayor a cero";
      valido = false;
    }

    if (!stock || Number(stock) <= 0) {
      nuevosErrores.stock =
        "El stock debe ser mayor a cero";
      valido = false;
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion =
        "Debe ingresar una descripción";
      valido = false;
    }

    setErrores(nuevosErrores);

    return valido;
  };

  const actualizarProducto = async () => {

    try {

    if (!validarFormulario()) {
      return;
    }

      const response = await fetch(
        ENDPOINTS.ACTUALIZAR_PRODUCTO,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_producto: producto.id_producto,
            nombre_producto: nombre,
            categoria_producto: categoria,
            marca_producto: marca,
            precio_producto: precio,
            precio_adquirido_producto:precioAdquirido,
            cantidad_producto: stock,
            descripcion_producto: descripcion,
            estado_producto: estado ? 1 : 0 ,
            precio_variable: precioVariable ? 1 : 0
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        onClose();

        await cargarProductos();

         window.dispatchEvent(
            new Event(
                "actualizarNotificaciones"
            )
        );

        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          text: data.message
        });

      } else {

        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message
        });

      }

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible actualizar"
      });

    }

  };

  return (
    <div className="modal-overlay">

      <div className="modal-container">

        <div className="modal-header">
          <h2>
            Editar Producto
          </h2>

          <button
            onClick={onClose}
            className="btn-close"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">

            <div className="form-group-full" style={{ display: "none" }}>
            <label>Id</label>
            <input
              type="text"
              placeholder="Ej. Aceite"
              value={IdProducto}
              onChange={(e) => setIdProducto(Number(e.target.value))}
            />
          </div>

          <div className="form-group-full">
            <label>Nombre *</label>
            <input
              type="text"
              placeholder="Ej. Aceite"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled
            />
          </div>


          <div className="row">

            <div className="form-group">
              <label>Categoría *</label>

              <select 
                value={categoria}
                  onChange={(e) =>
                    setCategoria(e.target.value)
                  }
                  disabled
                  >
                <option>Seleccionar...</option>
                {categorias.map((categoria) => (
                  <option
                    key={categoria.id_categoria}
                    value={categoria.id_categoria}
                  >
                    {categoria.nombre_categoria}
                  </option>
                ))}
              </select>

            </div>

            <div className="form-group">
              <label>Marca *</label>

              <select
              value={marca}
                  onChange={(e) =>
                    setMarca(e.target.value)
                  }
                  disabled
                  >
                <option>Seleccionar...</option>
                  {marcas.map((marca) => (
                    <option
                      key={marca.id_marca}
                      value={marca.id_marca}
                    >
                      {marca.nombre_marca}
                    </option>
                  ))}
              </select>

            </div>

          </div>

          <div className="row">

            <div className="form-group">
              <label>Precio *</label>

              <input
                type="number"
                placeholder="0"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
              />
              {errores.precio && (
                <span className="error-text">
                  {errores.precio}
                </span>
              )}
 
            </div>

            <div className="form-group">
              <label>Precio Adquirido</label>

              <input
                type="number"
                placeholder="0"
                value={precioAdquirido}
                onChange={(e) => setPrecioAdquirido(Number(e.target.value))}
              />
              {errores.precio_adquirido && (
                <span className="error-text">
                  {errores.precio_adquirido}
                </span>
              )}

            </div>

            <div className="form-group">
              <label>Stock Inicial *</label>

              <input
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
              {errores.stock && (
                <span className="error-text">
                  {errores.stock}
                </span>
              )}

            </div>


          </div>

          <div className="form-group-full">
            <label>Descripción</label>

            <textarea
              rows={4}
              placeholder="Descripción del producto..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
            {errores.descripcion && (
              <span className="error-text">
                {errores.descripcion}
              </span>
            )}

          <div className="row">
            <div className="estado-container">

              <label className="switch">
                  <input
                      type="checkbox"
                      checked={estado}
                      onChange={(e) =>
                          setEstado(e.target.checked)
                      }
                  />

                  <span className="slider"></span>
              </label>

              <span className="estado-label">
                  {estado ? "Activo" : "Inactivo"}
              </span>

          </div>

          <div className="estado-container">

              <label className="switch">
                  <input
                      type="checkbox"
                      checked={precioVariable}
                      onChange={(e) =>
                          setprecioVariable(e.target.checked)
                      }
                  />

                  <span className="slider"></span>
              </label>

              <span className="estado-label">
                  {precioVariable ? "Precio Variable" : "Precio Fijo"}
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
            onClick={actualizarProducto}
            disabled={desabilitar}
          >
            Actualizar
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditarProductoModal;