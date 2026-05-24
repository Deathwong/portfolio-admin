import client from './client'

export const getProjects   = ()        => client.get('/api/projects').then(r => r.data)
export const getProject    = (id)      => client.get(`/api/projects/${id}`).then(r => r.data)
export const createProject = (data)   => client.post('/api/projects', data).then(r => r.data)
export const updateProject = (id, data) => client.put(`/api/projects/${id}`, data).then(r => r.data)
export const deleteProject = (id)     => client.delete(`/api/projects/${id}`)
