import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ImageIcon, LineChart, Store } from 'lucide-react'
import { fetchAdminStats } from '../../services/restaurants'

function StatCard ({ icon: Icon, label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 card-shadow"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-orange-500/20">
          <Icon className="h-5 w-5 text-fuchsia-200" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function Dashboard () {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load () {
      try {
        const s = await fetchAdminStats()
        if (!cancelled) setStats(s)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Error')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Resumen de tu plataforma UrbanBites.</p>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
      )}

      {!stats && !error && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      )}

      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={Store} label="Restaurantes" value={stats.totalRestaurants} delay={0} />
            <StatCard icon={ImageIcon} label="Imágenes de carta" value={stats.totalImages} delay={0.05} />
            <StatCard icon={LineChart} label="Visitas registradas" value={stats.totalVisits} delay={0.1} />
          </div>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-bold text-white">Últimos agregados</h2>
            <ul className="mt-4 divide-y divide-white/10">
              {stats.recentRestaurants.length === 0 && (
                <li className="py-6 text-sm text-slate-500">Aún no hay restaurantes.</li>
              )}
              {stats.recentRestaurants.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold text-white">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.category}</p>
                  </div>
                  <Link
                    to={`/admin/restaurants/${r.id}/edit`}
                    className="shrink-0 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
                  >
                    Editar
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/admin/restaurants"
              className="mt-4 inline-flex text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300"
            >
              Ver todos →
            </Link>
          </section>
        </>
      )}
    </div>
  )
}
