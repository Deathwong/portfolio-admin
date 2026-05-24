import { NavLink } from 'react-router-dom'
import { MdDashboard, MdArticle, MdWork, MdEmail, MdLogout } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/',           icon: MdDashboard, label: 'Dashboard'   },
  { to: '/articles',   icon: MdArticle,   label: 'Articles'    },
  { to: '/projects',   icon: MdWork,      label: 'Projets'     },
  { to: '/newsletter', icon: MdEmail,     label: 'Newsletter'  },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">JBM</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">Portfolio Admin</p>
            <p className="text-xs text-gray-400">Jean-Baptiste Mensah</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="text-lg flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <MdLogout className="text-lg" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
