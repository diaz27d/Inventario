const API_URL = 'http://localhost:3333/api/v1'

export const ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  SIGNUP: `${API_URL}/auth/signup`,
  PROFILE: `${API_URL}/account/profile`,
  LOGOUT: `${API_URL}/account/logout`,
  LABELS: `${API_URL}/NombreLabelInputVariables`,
  PRODUCTOS: `${API_URL}/productos`,
  CATEGORIAS: `${API_URL}/categorias`,
}

export default API_URL