import { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, logout as apiLogout, me } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [checking, setChecking]             = useState(true)

  // Au démarrage, on vérifie si le cookie JWT est encore valide
  useEffect(() => {
    me()
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false))
  }, [])

  const login = async (email, password) => {
    await apiLogin(email, password)
    setAuthenticated(true)
  }

  const logout = async () => {
    await apiLogout()
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
