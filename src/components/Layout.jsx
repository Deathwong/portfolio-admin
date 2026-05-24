import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const TITLES = {
  '/':           'Dashboard',
  '/articles':   'Articles',
  '/projects':   'Projets',
  '/newsletter': 'Newsletter',
}

export default function Layout() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'Admin'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          <span className="text-xs text-gray-400 bg-purple-50 text-purple-500 px-2 py-1 rounded-full font-medium">
            Admin
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
