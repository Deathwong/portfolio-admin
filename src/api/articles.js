import client from './client'

export const getArticles  = ()        => client.get('/api/articles').then(r => r.data)
export const getArticle   = (id)      => client.get(`/api/articles/${id}`).then(r => r.data)
export const createArticle = (data)   => client.post('/api/articles', data).then(r => r.data)
export const updateArticle = (id, data) => client.put(`/api/articles/${id}`, data).then(r => r.data)
export const deleteArticle = (id)     => client.delete(`/api/articles/${id}`)
