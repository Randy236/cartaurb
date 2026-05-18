import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, MapPin, Sparkles, Star } from 'lucide-react'
import { MenuGallery } from '../components/MenuGallery'
import { MapEmbed } from '../components/MapEmbed'
import { TikTokEmbed } from '../components/TikTokEmbed'
import { RestaurantCardSkeleton } from '../components/RestaurantCardSkeleton'
import { EmptyState } from '../components/EmptyState'
import { fetchRestaurantById, logVisit } from '../services/restaurants'
import { isSupabaseConfigured } from '../lib/supabase'
import { TAGLINES } from '../lib/constants'

const placeholder =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7c3aed"/><stop offset="1" stop-color="#f97316"/></linearGradient></defs><rect width="1200" height="600" fill="url(#g)"/></svg>`,
  )

export function RestaurantDetail () {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const visitLogged = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function load () {
      if (!isSupabaseConfigured || !id) {
        setLoading(false)
        return
      }
      try {
        setError(null)
        const row = await fetchRestaurantById(id)
        if (!cancelled) setData(row)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!data?.id || visitLogged.current) return
    visitLogged.current = true
    logVisit(data.id)
  }, [data])

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Sin conexión" description="Configura Supabase en .env para ver este lugar." />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <RestaurantCardSkeleton />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="No encontramos este restaurante" description="Vuelve al inicio y busca de nuevo." />
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const rating = Number(data.rating) || 0
  const cover = data.cover_image || placeholder

  return (
    <article className="pb-16">
      <div className="relative h-[min(52vh,420px)] w-full overflow-hidden sm:h-[min(48vh,480px)]">
        <img
          src={cover}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0610] via-[#0b0610]/40 to-transparent" />
        <div className="absolute left-0 right-0 top-0 z-10 mx-auto flex max-w-6xl items-start justify-between px-4 pt-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md hover:bg-black/55 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver
          </Link>
          <span className="rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            {data.category}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-fuchsia-200">
              <Sparkles className="h-4 w-4" aria-hidden />
              {TAGLINES[0]}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {data.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 font-semibold text-orange-300">
                <Star className="h-4 w-4 fill-orange-300 text-orange-300" aria-hidden />
                {rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-fuchsia-300" aria-hidden />
                {data.address}
              </span>
            </div>
            {data.reference && (
              <p className="mt-2 max-w-2xl text-sm text-slate-300">Referencia: {data.reference}</p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        {data.description && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 card-shadow"
          >
            <h2 className="text-lg font-bold text-white">Sobre el lugar</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">{data.description}</p>
          </motion.section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-bold text-white">Galería de cartas</h2>
          <p className="mb-4 text-sm text-slate-400">{TAGLINES[1]}</p>
          <MenuGallery images={data.menu_images || []} restaurantName={data.name} />
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">Ubicación</h2>
            {data.maps_url ? (
              <MapEmbed mapsUrl={data.maps_url} title={`Mapa ${data.name}`} />
            ) : (
              <p className="text-sm text-slate-500">Sin mapa configurado.</p>
            )}
            {data.maps_url && (
              <a
                href={data.maps_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-300 hover:text-fuchsia-200"
              >
                Abrir en Google Maps
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-white">Video en TikTok</h2>
            <TikTokEmbed url={data.tiktok_url} />
            {data.tiktok_url && (
              <a
                href={data.tiktok_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-300 hover:text-fuchsia-200"
              >
                Ver en TikTok
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            )}
          </section>
        </div>
      </div>
    </article>
  )
}
