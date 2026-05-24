import { useEffect, useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdArticle } from 'react-icons/md'
import { getArticles, createArticle, updateArticle, deleteArticle } from '../api/articles'
import Modal from '../components/Modal'

const BLOCK_TYPES = ['TEXT', 'CODE', 'IMAGE', 'VIDEO', 'QUOTE', 'DIVIDER']
const EMPTY_BLOCK = { blockOrder: 1, type: 'TEXT', content: '', meta: '' }
const EMPTY_FORM  = { title: '', summary: '', coverImageUrl: '', tags: '', date: '', blocks: [] }

function BlockEditor({ blocks, onChange }) {
  const add = () =>
    onChange([...blocks, { ...EMPTY_BLOCK, blockOrder: blocks.length + 1 }])

  const remove = (i) =>
    onChange(blocks.filter((_, idx) => idx !== i).map((b, idx) => ({ ...b, blockOrder: idx + 1 })))

  const update = (i, field, val) =>
    onChange(blocks.map((b, idx) => idx === i ? { ...b, [field]: val } : b))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Blocs de contenu</label>
        <button type="button" onClick={add} className="text-xs text-purple-500 hover:text-purple-700 font-medium flex items-center gap-1">
          <MdAdd /> Ajouter un bloc
        </button>
      </div>

      {blocks.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
          Aucun bloc. Clique sur « Ajouter un bloc » pour commencer.
        </p>
      )}

      {blocks.map((b, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 w-6">#{i + 1}</span>
            <select
              className="input text-sm py-1.5 flex-1"
              value={b.type}
              onChange={e => update(i, 'type', e.target.value)}
            >
              {BLOCK_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            {b.type !== 'DIVIDER' && (
              <input
                className="input text-sm py-1.5 flex-1"
                placeholder={b.type === 'CODE' ? 'language (ex: java)' : b.type === 'IMAGE' ? 'légende' : b.type === 'QUOTE' ? 'auteur' : 'meta'}
                value={b.meta}
                onChange={e => update(i, 'meta', e.target.value)}
              />
            )}
            <button type="button" onClick={() => remove(i)} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
              <MdDelete />
            </button>
          </div>
          {b.type !== 'DIVIDER' && (
            <textarea
              className="input resize-none text-sm font-mono"
              rows={b.type === 'CODE' ? 6 : 3}
              placeholder={b.type === 'IMAGE' || b.type === 'VIDEO' ? 'https://...' : 'Contenu…'}
              value={b.content}
              onChange={e => update(i, 'content', e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    getArticles().then(setArticles).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true) }
  const openEdit   = (a) => {
    setEditing(a)
    setForm({ ...a, tags: (a.tags || []).join(', '), date: a.date || '' })
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
    }
    try {
      editing ? await updateArticle(editing.id, payload) : await createArticle(payload)
      setModal(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Supprimer « ${title} » ?`)) return
    await deleteArticle(id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Articles</h2>
          <p className="text-sm text-gray-500 mt-0.5">{articles.length} article{articles.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <MdAdd className="text-lg" /> Nouvel article
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Chargement…</div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
            <MdArticle className="text-4xl text-gray-200" />
            <p>Aucun article. Rédige-en un !</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Titre</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Tags</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Blocs</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">{a.title}</td>
                  <td className="px-6 py-3 text-gray-500">{a.date || '—'}</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(a.tags || []).map(t => (
                        <span key={t} className="badge bg-purple-50 text-purple-600">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{(a.blocks || []).length}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-gray-400 hover:bg-purple-50 hover:text-purple-500 transition-colors">
                        <MdEdit className="text-lg" />
                      </button>
                      <button onClick={() => handleDelete(a.id, a.title)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier l\'article' : 'Nouvel article'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
              <textarea className="input resize-none" rows={2} value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture URL</label>
              <input className="input" value={form.coverImageUrl} onChange={e => setForm({...form, coverImageUrl: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparé par ,)</label>
              <input className="input" placeholder="React, Java, DevOps" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <BlockEditor
              blocks={form.blocks || []}
              onChange={blocks => setForm({...form, blocks})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
