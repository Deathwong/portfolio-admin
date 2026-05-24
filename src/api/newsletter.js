import client from './client'

export const getSubscribers  = ()    => client.get('/api/newsletter/subscribers').then(r => r.data)
export const unsubscribe     = (id)  => client.delete(`/api/newsletter/subscribers/${id}`)
