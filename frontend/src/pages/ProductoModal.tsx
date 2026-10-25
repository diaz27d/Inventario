import "../../css/ProductoModal.css";
import { useState } from "react";
import { ENDPOINTS } from '../config/api'
import Swal from 'sweetalert2'

interface Props {
  abierto: boolean;
  onClose: () => void;
  categorias: Categoria[];
  marcas: Marca[];
  cargarProductos: () => Promise<void>;
  desabilitar: boolean;
}

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

interface Marca {
  id_marca: number;
  nombre_marca: string;
}

function ProductoModal({ abierto, onClose, categorias, marcas, cargarProductos, desabilitar }: Props) {
  if (!abierto) return null;

  const [nombre, setnombre] = useState("");
  const [categoria, setcategoria] = useState("")
  const [marca, setmarca] = useState("")
  const [precio, setprecio] = useState(0)
  const [precioAdqui, setprecioAdqui] = useState(0)
  const [stock, setstock] = useState(0)
  const [descripcion, setdescripcion] = useState("")

  const user = JSON.parse(
    localStorage.getItem("user") ?? "{}"
  );

  console.log(user)

  const [errores, setErrores] = useState({
    nombre: "",
    categoria: "",
    marca: "",
    precio: "",
    precio_adquirido: "",
    stock: "",
    descripcion: ""
  });

  const guardarProducto = async () => {

    if (!validarFormulario()) {
      return;
    }

    const response  = await fetch(
      ENDPOINTS.GUARDARPRODUCTO,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre_producto: nombre,
          id_categoria: categoria,
          id_marca: marca,
          precio_producto: precio,
          precio_adquirido_producto: precioAdqui,
          cantidad_producto: stock,
          descripcion_producto: descripcion,
          email: user.email
        })
      }
    )

    const data = await response.json()

    if(data.success){
        Swal.fire({
          icon: 'success',
          title: 'Producto registrado',
          text: data.message
        })
      onClose();
      await cargarProductos();
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Error al crear el producto',
        text: data.message,
        confirmButtonColor: '#f59e0b'
      })
    }
  };

  

  const validarFormulario = () => {

  const nuevosErrores = {
    nombre: "",
    categoria: "",
    marca: "",
    precio: "",
    precio_adquirido: "",
    stock: "",
    descripcion: ""
  };

  let valido = true;

  if (!nombre.trim()) {
    nuevosErrores.nombre =
      "Debe ingresar el nombre del producto";
    valido = false;
  }

  if (!categoria) {
    nuevosErrores.categoria =
      "Debe seleccionar una categoría";
    valido = false;
  }

  if (!marca) {
    nuevosErrores.marca =
      "Debe seleccionar una marca";
    valido = false;
  }

  if (!precio || Number(precio) <= 0) {
    nuevosErrores.precio =
      "El precio debe ser mayor a cero";
    valido = false;
  }

  if (!precioAdqui || Number(precioAdqui) <= 0) {
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

  return (
    <div className="modal-overlay">

      <div className="modal-container">

        <div className="modal-header">
          <h2>Nuevo Producto</h2>
          <button
            className="btn-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">

          <div className="form-group-full">
            <label>Nombre *</label>
            <input
              type="text"
              placeholder="Ej. Aceite"
              value={nombre}
              onChange={(e) => setnombre(e.target.value)}
            />
          </div>
          {errores.nombre && (
            <span className="error-text">
              {errores.nombre}
            </span>
          )}

          <div className="row">

            <div className="form-group">
              <label>Categoría *</label>

              <select 
                value={categoria}
                  onChange={(e) =>
                    setcategoria(e.target.value)
                  }
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
              {errores.categoria && (
                <span className="error-text">
                  {errores.categoria}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Marca *</label>

              <select
              value={marca}
                  onChange={(e) =>
                    setmarca(e.target.value)
                  }>
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

              {errores.marca && (
                <span className="error-text">
                  {errores.marca}
                </span>
              )}
            </div>

          </div>

          <div className="row">

            <div className="form-group">
              <label>Precio *</label>

              <input
                type="number"
                placeholder="0"
                value={precio}
                onChange={(e) => setprecio(Number(e.target.value))}
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
                value={precioAdqui}
                onChange={(e) => setprecioAdqui(Number(e.target.value))}
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
                onChange={(e) => setstock(Number(e.target.value))}
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
              onChange={(e) => setdescripcion(e.target.value)}
            />
          </div>
            {errores.descripcion && (
              <span className="error-text">
                {errores.descripcion}
              </span>
            )}

          <div className="form-group-full" style={{ display: "none" }}>
            <label>Email</label>
            <input
              type="text"
              placeholder="Ej. Aceite"
              value={user.email}
            />
          </div>

        </div>

        <div className="modal-footer">

          <button className="btn-guardar"
                  onClick={guardarProducto}
                  disabled={desabilitar}
                  >
            💾 Guardar
          </button>

          <button
            className="btn-cancelar"
            onClick={onClose}
          >
            ✕ Cancelar
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductoModal;