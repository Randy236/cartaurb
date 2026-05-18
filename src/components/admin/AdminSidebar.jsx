import { NavLink } from 'react-router-dom'
import { LayoutDashboard, LogOut, Store } from 'lucide-react'
import { motion } from 'framer-motion'
import { APP_NAME } from '../../lib/constants'

const item =
  'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors'

export function AdminSidebar ({ onSignOut, collapsed }) {
  return (
    <aside
      className={`shrink-0 border-r border-white/10 bg-[#0b0610]/95 backdrop-blur-xl ${
        collapsed ? 'w-0 overflow-hidden md:w-64' : 'w-full md:w-64'
      }`}
    >
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 px-1">
          <p className="text-xs font-medium uppercase tracking-wider text-fuchsia-300/90">Panel</p>
          <p className="text-lg font-bold text-white">{APP_NAME}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${item} ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
            }
          >
            <LayoutDashboard className="h-5 w-5" aria-hidden />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/restaurants"
            className={({ isActive }) =>
              `${item} ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
            }
          >
            <Store className="h-5 w-5" aria-hidden />
            Restaurantes
          </NavLink>
        </nav>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onSignOut}
          className={`${item} mt-4 text-red-300 hover:bg-red-500/10`}
        >
          <LogOut className="h-5 w-5" aria-hidden />
          Cerrar sesión
        </motion.button>
      </div>
    </aside>
  )
}
