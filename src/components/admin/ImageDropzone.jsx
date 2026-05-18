import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImagePlus, Trash2, GripVertical } from 'lucide-react'

export function ImageDropzone ({
  files,
  onAdd,
  onRemove,
  disabled,
  progress,
  label = 'Arrastra imágenes o haz clic',
}) {
  const [drag, setDrag] = useState(false)

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDrag(false)
      if (disabled) return
      const list = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'))
      if (list.length) onAdd(list)
    },
    [disabled, onAdd],
  )

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            document.getElementById('file-input-menu')?.click()
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('file-input-menu')?.click()}
        className={`cursor-pointer rounded-3xl border-2 border-dashed px-4 py-10 text-center transition ${
          drag
            ? 'border-fuchsia-400 bg-fuchsia-500/10'
            : 'border-white/15 bg-white/[0.03] hover:border-white/25'
        } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          id="file-input-menu"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const list = Array.from(e.target.files || [])
            if (list.length) onAdd(list)
            e.target.value = ''
          }}
        />
        <ImagePlus className="mx-auto h-10 w-10 text-fuchsia-300" aria-hidden />
        <p className="mt-2 text-sm font-semibold text-white">{label}</p>
        <p className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP · se comprimen antes de subir</p>
      </div>

      {progress != null && progress >= 0 && progress < 100 && (
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      )}

      <AnimatePresence initial={false}>
        {files.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {files.map((item, idx) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2"
              >
                <GripVertical className="hidden h-4 w-4 shrink-0 text-slate-500 sm:block" aria-hidden />
                <img
                  src={item.preview}
                  alt=""
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">{item.file.name}</p>
                  <p className="text-[11px] text-slate-500">#{idx + 1}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-red-500/15 hover:text-red-300"
                  aria-label="Quitar imagen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </AnimatePresence>
    </div>
  )
}
