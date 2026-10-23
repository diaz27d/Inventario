import { useEffect, useState } from "react";

import Layout from "../layaouts/Layaout";

import {
  FaBox,
  FaWarehouse,
  FaShoppingCart,
  FaTags
} from "react-icons/fa";

import { ENDPOINTS } from "../config/api";

import "../../css/Home.css";

interface Label {
  id: number;
  title: string;
}

function Dashboard() {

  const [dashboard, setDashboard] = useState<any>(null);
  const [labelInput, setLabelInputs] = useState<Label[]>([])

  const cargarDashboard = async () => {

    try {

      const response =
        await fetch(
          ENDPOINTS.DASBOARD,
          {
            method: "POST"
          }
        );

      const data =
        await response.json();

      setDashboard(data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    cargarDashboard();

  }, []);

    useEffect(() => {
    const cargarLabels = async () => {
      try {

        const response = await fetch(
          ENDPOINTS.LABELS
        )

        const data = await response.json()

        setLabelInputs(data ?? [])
      } catch (error) {
        console.error(error)
      }
    }

    cargarLabels()
  }, [])

  return (

    <Layout>

      <div className="dashboard-page">

        <div className="bienvenida-card">

          <h2>
            Aquí tienes un resumen del sistema de inventario de {labelInput?.[1]?.title}
          </h2>

        </div>

        <div className="dashboard-cards">

          <div className="dashboard-card card-productos">

            <FaBox />

            <span>
              Productos
            </span>
            
            <strong>
              { dashboard?.productos || 0 }
            </strong>

          </div>

          <div className="dashboard-card card-inventario">

            <FaWarehouse />

            <span>
              Inventario
            </span>

            <strong>

              { dashboard?.inventario || 0 }

            </strong>

          </div>

          <div className="dashboard-card card-ventas">

            <FaShoppingCart />

            <span>
              Ventas Hoy
            </span>

            <strong>
              $
              {Number( dashboard?.ventasHoy || 0 ).toLocaleString( "es-CO" )}

            </strong>

          </div>

          <div className="dashboard-card card-categorias">

            <FaTags />

            <span>
              Categorías
            </span>

            <strong>
              { dashboard?.categorias || 0 }
            </strong>

          </div>

        </div>

        <div className="dashboard-grid">

          <div className="dashboard-panel">

            <h3>
              Últimas Ventas
            </h3>

            {
              dashboard?.ultimasVentas?.map(
                (
                  venta: any
                ) => (

                <div className="item-dashboard">

                  <span className="venta-id">
                      Venta #{venta.id_valor_total}
                  </span>

                  <span className="venta-cliente">
                      {venta.nombre_cliente}
                  </span>

                  <span className="venta-total">

                      $

                      {Number(venta.valor_pagado ).toLocaleString("es-CO")}

                  </span>

              </div>

              ))
            }

          </div>
            <div className="dashboard-grid">
              <div className="dashboard-panel">

                <h3>
                    Productos con Menor Stock
                </h3>

                {dashboard?.menorStock?.map(
                    (producto: any) => (

                    <div
                        key={producto.id_producto}
                        className="stock-item"
                    >

                        <span className="stock-nombre">
                            {producto.nombre_producto}
                        </span>

                        <span className="stock-cantidad">
                            {producto.cantidad_producto}
                        </span>

                    </div>

                ))}

            </div>
          </div>

        </div>

      </div>

    </Layout>

  );

}

export default Dashboard;