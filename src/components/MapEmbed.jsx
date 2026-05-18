import { toMapsEmbedSrc } from '../lib/maps'

export function MapEmbed ({ mapsUrl, title }) {
  const src = toMapsEmbedSrc(mapsUrl)
  if (!src) return null

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-xl">
      <iframe
        title={title || 'Mapa'}
        src={src}
        className="aspect-video w-full min-h-[220px] border-0 sm:min-h-[280px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}
