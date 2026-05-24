import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdArticle, MdWork, MdEmail, MdArrowForward } from 'react-icons/md'
import { getArticles } from '../api/articles'
import { getProjects } from '../api/projects'
import { getSubscribers } from '../api/newsletter'

function StatCard({ icon: Icon, label, value, to, color }) {
  return (
    <Link to={to} className="card p-6 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {value === null ? '—' : value}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-4 text-xs text-purple-500 font-medium group-hover:gap-2 transition-all">
        Voir tout <MdArrowForward />
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const [counts, setCounts] = useState({ articles: null, projects: null, subscribers: null })

  useEffect(() => {
    Promise.all([getArticles(), getProjects(), getSubscribers()])
      .then(([articles, projects, subscribers]) => {
        setCounts({
          articles: articles.length,
          projects: projects.length,
          subscribers: subscribers.length,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bonjour 👋</h2>
        <p className="text-gray-500 mt-1">Vue d'ensemble de ton portfolio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          icon={MdArticle}
          label="Articles"
          value={counts.articles}
          to="/articles"
          color="bg-purple-400"
        />
        <StatCard
          icon={MdWork}
          label="Projets"
          value={counts.projects}
          to="/projects"
          color="bg-indigo-400"
        />
        <StatCard
          icon={MdEmail}
          label="Abonnés newsletter"
          value={counts.subscribers}
          to="/newsletter"
          color="bg-pink-400"
        />
      </div>
    </div>
  )
}
