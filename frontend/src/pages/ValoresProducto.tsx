import { useState } from "react";
import Layout from "../layaouts/Layaout";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTag
} from "react-icons/fa";

import "../../css/ValoresProducto.css";

function ValoresProducto() {

  const [productoSeleccionado] =
    useState("Laptop HP");

  const valores = [
    {
      id: 1,
      tipo: "Memoria",
      valor: "16 GB"
    },
    {
      id: 2,
      tipo: "Disco",
      valor: "512 SSD"
    },
    {
      id: 3,
      tipo: "Procesador",
      valor: "Intel i7"
    },
    {
      id: 4,
      tipo: "Pantalla",
      valor: '15.6"'
    }
  ];

  return (
    <Layout>

      <div className="valores-page">

        <div className="valores-header">

          <div>
            <h1>Valores del Producto</h1>

            <p>
              Gestiona las características
              del producto.
            </p>
          </div>

          <button className="btn-nuevo-valor">
            <FaPlus />
            Nuevo Valor
          </button>

        </div>

        <div className="producto-info">

          <FaTag />

          <span>
            Producto:
            <strong>
              {" "}
              {productoSeleccionado}
            </strong>
          </span>

        </div>

        <div className="tabla-valores">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {valores.map((item) => (

                <tr key={item.id}>

                  <td>
                    {item.id
                      .toString()
                      .padStart(2, "0")}
                  </td>

                  <td>{item.tipo}</td>

                  <td>{item.valor}</td>

                  <td className="acciones">

                    <button
                      className="btn-editar"
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="btn-eliminar"
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
}

export default ValoresProducto;