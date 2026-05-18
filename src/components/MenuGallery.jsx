import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'

export function MenuGallery ({ images = [], restaurantName }) {
  const [index, setIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const touchStartX = useRef(null)

  const list = images.length ? images : []
  const current = list[index]

  const go = (dir) => {
    if (!list.length) return
    setIndex((i) => (i + dir + list.length) % list.length)
  }

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (dx > 50) go(-1)
    if (dx < -50) go(1)
  }

  const openFs = useCallback(() => setFullscreen(true), [])
  const closeFs = useCallback(() => setFullscreen(false), [])

  if (!list.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center text-slate-400">
        Aún no hay imágenes de carta para este lugar.
      </div>
    )
  }

  return (
    <>
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f0a14] card-shadow"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative aspect-[4/5] max-h-[min(70vh,820px)] w-full sm:aspect-[3/4] md:aspect-[16/11]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={current.id || current.image_url}
              src={current.image_url}
              alt={`Carta de ${restaurantName || 'restaurante'} — ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              initial={{ opacity: 0.2, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full cursor-zoom-in object-contain bg-black/40"
              onClick={openFs}
            />
          </AnimatePresence>

          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 sm:left-3"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 sm:right-3"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={openFs}
            className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-black/70"
          >
            <Maximize2 className="h-3.5 w-3.5" aria-hidden />
            Pantalla completa
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 py-3">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a imagen ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-fuchsia-400' : 'w-2 bg-white/25 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && current && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Vista ampliada de la carta"
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={closeFs}
              aria-label="Cerrar"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              src={current.image_url}
              alt=""
              className="max-h-[90vh] max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
