import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminDeleteRestaurant, adminListRestaurants } from '../../services/restaurants'
import { ConfirmModal } from '../../components/ConfirmModal'
import { removeStorageObjectByPublicUrl } from '../../lib/imageUpload'

export function RestaurantsAdmin () {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState(null)

  async function refresh () {
    const data = await adminListRestaurants()
    setRows(data)
  }

  useEffect(() => {
    let cancelled = false
    async function load () {
      try {
        await refresh()
      } catch (e) {
        if (!cancelled) toast.error(e.message || 'Error al cargar')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function confirmDelete () {
    if (!pendingDelete) return
    try {
      const imgs = await adminDeleteRestaurant(pendingDelete.id)
      await removeStorageObjectByPublicUrl(pendingDelete.cover_image)
      for (const row of imgs || []) {
        await removeStorageObjectByPublicUrl(row.image_url)
      }
      toast.success('Restaurante eliminado')
      setPendingDelete(null)
      await refresh()
    } catch (e) {
      toast.error(e.message || 'No se pudo eliminar')
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Restaurantes</h1>
          <p className="mt-1 text-sm text-slate-400">Crea, edita o elimina fichas y cartas.</p>
        </div>
        <Link
          to="/admin/restaurants/new"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-600/25"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Nuevo restaurante
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        {loading && <div className="p-8 text-sm text-slate-500">Cargando…</div>}
        {!loading && rows.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">No hay restaurantes aún.</div>
        )}
        {!loading && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Categoría</th>
                  <th className="px-4 py-3 font-semibold">Rating</th>
                  <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 font-medium text-white">{r.name}</td>
                    <td className="px-4 py-3 text-slate-400">{r.category}</td>
                    <td className="px-4 py-3 text-orange-300">{Number(r.rating).toFixed(1)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Link
                          to={`/admin/restaurants/${r.id}/edit`}
                          className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(r)}
                          className="rounded-xl p-2 text-slate-300 hover:bg-red-500/15 hover:text-red-300"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="¿Eliminar restaurante?"
        message="Se borrarán también las imágenes de carta en la base de datos. Las fotos en Storage se intentarán limpiar."
        confirmLabel="Eliminar"
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
