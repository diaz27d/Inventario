const API_URL = 'http://localhost:3333/api/v1'

export const ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  SIGNUP: `${API_URL}/auth/signup`,
  PROFILE: `${API_URL}/account/profile`,
  LOGOUT: `${API_URL}/account/logout`,
  LABELS: `${API_URL}/NombreLabelInputVariables`,
  PRODUCTOS: `${API_URL}/ProductosExistentes`,
  PRODUCTOSCOMBOS: `${API_URL}/ProductosCombos`,
  ACTUALIZAR_PRODUCTO: `${API_URL}/ActualizarProducto`,
  GUARDARPRODUCTO: `${API_URL}/GuardarProducto`,
  CATEGORIAS: `${API_URL}/CategoriasExistentes`,
  CATEGORIAS_COMBOS: `${API_URL}/CategoriasCombos`,
  GUARDARCATEGORIAS: `${API_URL}/CategoriasGuardar`,
  MARCAS: `${API_URL}/MarcasExistentes`,
  MARCAS_COMBOS: `${API_URL}/MarcasCombos`,
  GUARDARMARCA: `${API_URL}/MarcasGuardar`,
  GUARDARINVENTARIO: `${API_URL}/GuardarInventario`,
  
}

export default API_URL