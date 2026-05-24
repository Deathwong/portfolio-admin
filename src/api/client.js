import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
})

// Injecte le token sur chaque requête
client.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers['X-API-Key'] = token
  return config
})

// Redirige vers /login si le token est invalide/expiré
client.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
