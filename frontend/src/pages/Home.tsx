import '../../css/Home.css'
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import Layout from "../layaouts/Layaout";



function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }

  }, []);
  


  return (
    <Layout>
      <div className="dashboard">
        {/* Contenido */}
        <main className="content">

          <header className="header">
            <h2>Bienvenido aquí tienes un resumen del sistema de inventario</h2>
          </header>

          {/* Tarjetas */}
          <section className="cards">

            <div className="card blue">
              <h3>Productos</h3>
              <span>120</span>
            </div>

            <div className="card green">
              <h3>Inventario</h3>
              <span>890</span>
            </div>

            <div className="card yellow">
              <h3>Ventas Hoy</h3>
              <span>$3.250</span>
            </div>

            <div className="card purple">
              <h3>Categorías</h3>
              <span>10</span>
            </div>

          </section>

          {/* Gráfico y actividad */}
          <section className="dashboard-bottom">

            <div className="chart-container">
              <h3>Entradas vs Salidas</h3>

              <div className="fake-chart">
                <div style={{height: "80%"}}></div>
                <div style={{height: "50%"}}></div>
                <div style={{height: "70%"}}></div>
                <div style={{height: "40%"}}></div>
                <div style={{height: "90%"}}></div>
              </div>

            </div>

            <div className="activity">
              <h3>Actividad reciente</h3>

              <ul>
                <li>✅ Entrada de portátil HP</li>
                <li>📤 Salida de impresora Epson</li>
                <li>➕ Nuevo producto registrado</li>
                <li>✏️ Categoría actualizada</li>
              </ul>

            </div>

          </section>

        </main>

      </div>
    </Layout>
  );
}

export default Home;