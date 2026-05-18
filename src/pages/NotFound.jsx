import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search } from 'lucide-react'

export function NotFound () {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <p className="relative text-8xl font-black tracking-tighter text-gradient sm:text-9xl">404</p>
      </motion.div>
      <motion.h1
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="mt-4 text-2xl font-bold text-white sm:text-3xl"
      >
        Esta ruta no existe
      </motion.h1>
      <p className="mt-2 max-w-md text-sm text-slate-400 sm:text-base">
        Pero sí existen buenas cartas en Juliaca. Vuelve al inicio o busca un restaurante.
      </p>
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-600/30"
        >
          <Home className="h-4 w-4" aria-hidden />
          Ir al inicio
        </Link>
        <Link
          to="/#categorias"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
        >
          <Search className="h-4 w-4" aria-hidden />
          Explorar categorías
        </Link>
      </motion.div>
    </div>
  )
}
