import { motion } from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'
import { APP_NAME, HERO_SUBTITLE, TAGLINES } from '../lib/constants'

export function SearchHero ({ value, onChange, suggestions = [], onPickSuggestion }) {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-24 h-80 w-80 rounded-full bg-orange-500/25 blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-fuchsia-200"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {TAGLINES[0]}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-5 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          Encuentra cartas completas, precios y recomendaciones de{' '}
          <span className="text-gradient">{APP_NAME}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-slate-300 sm:text-base"
        >
          {HERO_SUBTITLE}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative mx-auto mt-8 max-w-2xl text-left"
        >
          <label className="sr-only" htmlFor="search-restaurants">
            Buscar restaurante
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fuchsia-300"
              aria-hidden
            />
            <input
              id="search-restaurants"
              type="search"
              autoComplete="off"
              placeholder="Ej: Vintage, chifa, pollería..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-12 pr-4 text-base text-white shadow-inner shadow-black/20 outline-none ring-2 ring-transparent placeholder:text-slate-500 focus:border-fuchsia-500/40 focus:ring-fuchsia-500/30"
            />
          </div>

          {suggestions.length > 0 && value.trim().length >= 2 && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-white/10 bg-[#120a1a]/95 py-2 shadow-2xl backdrop-blur-xl"
              role="listbox"
            >
              {suggestions.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/10"
                    onClick={() => {
                      onChange(r.name)
                      onPickSuggestion?.(r)
                    }}
                  >
                    <span className="font-medium text-white">{r.name}</span>
                    <span className="text-xs text-slate-400">{r.category}</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </div>
    </section>
  )
}
