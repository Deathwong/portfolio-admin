import { useEffect, useState } from 'react'
import { MdDelete, MdEmail } from 'react-icons/md'
import { getSubscribers, unsubscribe } from '../api/newsletter'

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading]         = useState(true)

  const load = () => {
    setLoading(true)
    getSubscribers()
      .then(setSubscribers)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id, email) => {
    if (!confirm(`Désabonner ${email} ?`)) return
    await unsubscribe(id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Abonnés newsletter</h2>
          <p className="text-sm text-gray-500 mt-0.5">{subscribers.length} abonné{subscribers.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Chargement…</div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
            <MdEmail className="text-4xl text-gray-200" />
            <p>Aucun abonné pour l'instant.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Téléphone</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Profil</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Inscrit le</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">{s.email}</td>
                  <td className="px-6 py-3 text-gray-500">{s.phone || '—'}</td>
                  <td className="px-6 py-3">
                    {s.profile
                      ? <span className="badge bg-purple-50 text-purple-600">{s.profile}</span>
                      : <span className="text-gray-400">—</span>
                    }
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s.id, s.email)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
