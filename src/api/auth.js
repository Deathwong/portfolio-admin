import client from './client'

export const login = (email, password) =>
  client.post('/api/auth/login', { email, password }).then(r => r.data.token)
