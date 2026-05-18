import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, ExternalLink } from 'lucide-react'

const placeholder =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7c3aed"/><stop offset="1" stop-color="#f97316"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><text x="400" y="260" text-anchor="middle" fill="white" font-family="system-ui" font-size="28" opacity=".9">UrbanBites</text></svg>`,
  )

export function RestaurantCard ({ restaurant, index = 0 }) {
  const rating = Number(restaurant.rating) || 0
  const cover = restaurant.cover_image || placeholder

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 320, damping: 28 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] card-shadow"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0610] via-transparent to-transparent opacity-90" />
        <span className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {restaurant.category}
        </span>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">{restaurant.name}</h3>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-400" aria-hidden />
              <span className="line-clamp-2">{restaurant.address || 'Juliaca'}</span>
            </p>
            {restaurant.reference && (
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">Ref: {restaurant.reference}</p>
            )}
          </div>
          <div
            className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-sm font-semibold text-orange-300"
            title="Calificación"
          >
            <Star className="h-4 w-4 fill-orange-300 text-orange-300" aria-hidden />
            {rating.toFixed(1)}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to={`/restaurant/${restaurant.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-600/30 transition hover:brightness-110"
          >
            Ver carta
            <ExternalLink className="h-4 w-4 opacity-80" aria-hidden />
          </Link>
          {restaurant.maps_url && (
            <a
              href={restaurant.maps_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Cómo llegar
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
