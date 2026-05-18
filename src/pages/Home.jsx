import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { SearchHero } from '../components/SearchHero'
import { CategoryStrip } from '../components/CategoryStrip'
import { RestaurantCard } from '../components/RestaurantCard'
import { RestaurantCardSkeleton } from '../components/RestaurantCardSkeleton'
import { EmptyState, EmptyStateNoConfig } from '../components/EmptyState'
import { useDebounce } from '../hooks/useDebounce'
import { fetchRestaurants, searchRestaurants } from '../services/restaurants'
import { isSupabaseConfigured } from '../lib/supabase'
import { TAGLINES } from '../lib/constants'

export function Home () {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 200)
  const [category, setCategory] = useState(null)
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load () {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }
      try {
        setError(null)
        const data = await fetchRestaurants()
        if (!cancelled) setAll(data)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Error al cargar')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const [searchResults, setSearchResults] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false
    async function run () {
      const q = debounced.trim()
      if (!q) {
        setSearchResults(null)
        return
      }
      try {
        setSearchLoading(true)
        const data = await searchRestaurants(q)
        if (!cancelled) setSearchResults(data)
      } catch {
        if (!cancelled) setSearchResults([])
      } finally {
        if (!cancelled) setSearchLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [debounced])

  const baseList = searchResults != null ? searchResults : all

  const categories = useMemo(() => {
    const s = new Set()
    all.forEach((r) => r.category && s.add(r.category))
    return [...s].sort((a, b) => a.localeCompare(b))
  }, [all])

  const filtered = useMemo(() => {
    if (!category) return baseList
    return baseList.filter((r) => r.category === category)
  }, [baseList, category])

  const featured = useMemo(() => {
    return [...all].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 6)
  }, [all])

  const catalogList = useMemo(() => {
    if (query.trim() || category) return filtered
    const ids = new Set(featured.map((r) => r.id))
    return filtered.filter((r) => !ids.has(r.id))
  }, [filtered, featured, query, category])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const pool = searchResults != null ? searchResults : all
    return pool.filter((r) => r.name.toLowerCase().includes(q)).slice(0, 6)
  }, [query, searchResults, all])

  useEffect(() => {
    if (location.hash !== '#categorias') return
    const id = window.setTimeout(() => {
      document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    return () => window.clearTimeout(id)
  }, [location.hash, location.pathname])

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <EmptyStateNoConfig />
      </div>
    )
  }

  return (
    <div>
      <SearchHero
        value={query}
        onChange={setQuery}
        suggestions={suggestions}
        onPickSuggestion={(r) => navigate(`/restaurant/${r.id}`)}
      />

      <CategoryStrip categories={categories} active={category} onPick={setCategory} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white sm:text-2xl">
              <Flame className="h-6 w-6 text-orange-400" aria-hidden />
              Destacados en Juliaca
            </h2>
            <p className="mt-1 text-sm text-slate-400">{TAGLINES[1]}</p>
          </div>
        </div>

        {!loading && !error && featured.length > 0 && !query.trim() && !category && (
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} index={i} />
            ))}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-white">
            {!query.trim() && !category ? 'Más restaurantes' : 'Catálogo'}
          </h3>
          {searchLoading && (
            <span className="text-xs font-medium text-fuchsia-300">Buscando...</span>
          )}
        </div>

        {error && (
          <EmptyState title="Algo salió mal" description={error} />
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && catalogList.length === 0 && !(featured.length > 0 && !query.trim() && !category) && (
          <EmptyState
            title="Sin resultados"
            description="Prueba otra palabra o cambia de categoría."
          />
        )}

        {!loading && !error && catalogList.length === 0 && featured.length > 0 && !query.trim() && !category && (
          <p className="text-center text-sm text-slate-500">Ya viste los destacados arriba ✨</p>
        )}

        {!loading && !error && catalogList.length > 0 && (
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {catalogList.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} index={i} />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}
