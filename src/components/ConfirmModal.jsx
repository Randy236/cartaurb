import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export function ConfirmModal ({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
          onClick={onCancel}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#120a1a] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  variant === 'danger' ? 'bg-red-500/15 text-red-300' : 'bg-white/10 text-white'
                }`}
              >
                <AlertTriangle className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 id="confirm-title" className="text-lg font-bold text-white">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-slate-400">{message}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white ${
                  variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-fuchsia-600 hover:bg-fuchsia-500'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
