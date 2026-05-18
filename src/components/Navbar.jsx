import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, UtensilsCrossed, X } from 'lucide-react'
import { useState } from 'react'
import { APP_NAME } from '../lib/constants'

const linkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`

export function Navbar () {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0610]/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-left" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-orange-500 shadow-lg shadow-fuchsia-500/25">
            <UtensilsCrossed className="h-5 w-5 text-white" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight text-white">{APP_NAME}</span>
            <span className="text-xs text-slate-400">Juliaca · cartas reales</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {!isAdmin && (
            <>
              <NavLink to="/" className={linkClass} end>
                Inicio
              </NavLink>
              <NavLink to="/#categorias" className={linkClass}>
                Categorías
              </NavLink>
            </>
          )}
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        </nav>

        <button
          type="button"
          className="inline-flex rounded-xl border border-white/10 bg-white/5 p-2 text-white md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-white/10 bg-[#0b0610]/95 md:hidden"
        >
          <div className="flex flex-col gap-1 px-4 py-3">
            <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
              Inicio
            </NavLink>
            <NavLink to="/#categorias" className={linkClass} onClick={() => setOpen(false)}>
              Categorías
            </NavLink>
            <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
              Admin
            </NavLink>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
