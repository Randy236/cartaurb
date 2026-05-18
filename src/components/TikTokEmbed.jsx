import { getTikTokEmbedSrc } from '../lib/tiktok'

export function TikTokEmbed ({ url }) {
  const src = getTikTokEmbedSrc(url)
  if (!src) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">
        Añade un enlace válido de TikTok (formato tiktok.com/@usuario/video/ID) para embeber el video
        aquí.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-xl">
      <iframe
        title="Video de TikTok"
        src={src}
        className="h-[min(560px,70vh)] w-full border-0"
        allow="encrypted-media; fullscreen"
        loading="lazy"
      />
    </div>
  )
}
