import { useEffect, useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdWork, MdOpenInNew } from 'react-icons/md'
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects'
import Modal from '../components/Modal'

const EMPTY = { title: '', description: '', imgUrl: '', techStack: '', tags: '', ghLink: '', demoLink: '', details: '' }

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    getProjects().then(setProjects).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit   = (p)  => {
    setEditing(p)
    setForm({
      ...p,
      techStack: (p.techStack || []).join(', '),
      tags:      (p.tags || []).join(', '),
    })
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
      tags:      form.tags.split(',').map(s => s.trim()).filter(Boolean),
    }
    try {
      editing ? await updateProject(editing.id, payload) : await createProject(payload)
      setModal(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Supprimer « ${title} » ?`)) return
    await deleteProject(id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Projets</h2>
          <p className="text-sm text-gray-500 mt-0.5">{projects.length} projet{projects.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <MdAdd className="text-lg" /> Nouveau projet
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Chargement…</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
            <MdWork className="text-4xl text-gray-200" />
            <p>Aucun projet. Crée-en un !</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Titre</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Stack</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Liens</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">{p.title}</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(p.techStack || []).slice(0, 3).map(t => (
                        <span key={t} className="badge bg-indigo-50 text-indigo-600">{t}</span>
                      ))}
                      {(p.techStack || []).length > 3 && (
                        <span className="badge bg-gray-100 text-gray-500">+{p.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {p.ghLink   && <a href={p.ghLink}   target="_blank" rel="noreferrer" className="badge bg-gray-100 text-gray-600 gap-1"><MdOpenInNew className="text-xs" />GitHub</a>}
                      {p.demoLink && <a href={p.demoLink} target="_blank" rel="noreferrer" className="badge bg-green-50 text-green-600 gap-1"><MdOpenInNew className="text-xs" />Démo</a>}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:bg-purple-50 hover:text-purple-500 transition-colors">
                        <MdEdit className="text-lg" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.title)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
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

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier le projet' : 'Nouveau projet'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input className="input" value={form.imgUrl} onChange={e => setForm({...form, imgUrl: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stack (séparé par ,)</label>
              <input className="input" placeholder="React, Java, Docker" value={form.techStack} onChange={e => setForm({...form, techStack: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparé par ,)</label>
              <input className="input" placeholder="Frontend, Backend" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input className="input" value={form.ghLink} onChange={e => setForm({...form, ghLink: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Démo URL</label>
              <input className="input" value={form.demoLink} onChange={e => setForm({...form, demoLink: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Détails (markdown)</label>
              <textarea className="input resize-none font-mono text-xs" rows={4} value={form.details} onChange={e => setForm({...form, details: e.target.value})} />
            </div>
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
