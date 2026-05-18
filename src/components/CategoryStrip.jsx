import { motion } from 'framer-motion'

export function CategoryStrip ({ categories, active, onPick }) {
  return (
    <section id="categorias" className="scroll-mt-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-lg font-bold text-white sm:text-xl">Categorías</h2>
        <p className="mt-1 text-sm text-slate-400">Toca una categoría para filtrar al instante.</p>
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onPick(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              active == null
                ? 'bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white shadow-lg shadow-fuchsia-600/25'
                : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            Todas
          </motion.button>
          {categories.map((c) => (
            <motion.button
              key={c}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onPick(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === c
                  ? 'bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white shadow-lg shadow-fuchsia-600/25'
                  : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              {c}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
