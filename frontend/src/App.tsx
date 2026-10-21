import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Categorias from './pages/Categorias'
import Marcas from './pages/Marcas'
import RegistroInventario from './pages/RegistroInventario'
import HistorialMovimientos from './pages/HistorialMovimientos'
import ConsolidadoReportes from './pages/ConsolidadoReportes'
import Clientes from './pages/Clientes'
import DeudasClientes from './pages/DeudasClientes'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/categorias" element={<Categorias />}/>
        <Route path="/marcas" element={<Marcas />}/>
        <Route path="/registro-inventario" element={<RegistroInventario />}/>
        <Route path="/historial-movimientos" element={<HistorialMovimientos />}/>
        <Route path="/consolidado-reportes" element={<ConsolidadoReportes />}/>
        <Route path="/clientes" element={<Clientes />}/>
        <Route path="/deudas-clientes" element={<DeudasClientes />}/>
      </Routes>
        
  )
}

export default App