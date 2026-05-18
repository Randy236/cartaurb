import { motion } from 'framer-motion'
import { Compass, SearchX } from 'lucide-react'

export function EmptyState ({ title, description, icon: Icon = SearchX }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-orange-500/20">
        <Icon className="h-7 w-7 text-fuchsia-200" aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </motion.div>
  )
}

export function EmptyStateNoConfig () {
  return (
    <EmptyState
      icon={Compass}
      title="Falta conectar Supabase"
      description="Crea un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY, ejecuta el SQL de supabase/migrations y recarga."
    />
  )
}
