import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Save } from 'lucide-react'
import { CATEGORY_OPTIONS } from '../../lib/constants'
import { ImageDropzone } from '../../components/admin/ImageDropzone'
import {
  adminCreateRestaurant,
  adminUpdateRestaurant,
  fetchRestaurantById,
} from '../../services/restaurants'
import { uploadRestaurantImage, removeStorageObjectByPublicUrl } from '../../lib/imageUpload'

function newLocalId () {
  return crypto.randomUUID()
}

export function RestaurantEditor () {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState(-1)

  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0])
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [reference, setReference] = useState('')
  const [mapsUrl, setMapsUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [rating, setRating] = useState('4.5')

  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [coverExisting, setCoverExisting] = useState('')

  const [menuExisting, setMenuExisting] = useState([])
  const [menuPending, setMenuPending] = useState([])

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    async function load () {
      try {
        const row = await fetchRestaurantById(id)
        if (cancelled || !row) {
          toast.error('No se encontró el restaurante')
          navigate('/admin/restaurants', { replace: true })
          return
        }
        setName(row.name || '')
        setCategory(row.category || CATEGORY_OPTIONS[0])
        setDescription(row.description || '')
        setAddress(row.address || '')
        setReference(row.reference || '')
        setMapsUrl(row.maps_url || '')
        setTiktokUrl(row.tiktok_url || '')
        setRating(String(row.rating ?? '4.5'))
        setCoverExisting(row.cover_image || '')
        setMenuExisting((row.menu_images || []).map((m) => m.image_url))
      } catch (e) {
        toast.error(e.message || 'Error al cargar')
        navigate('/admin/restaurants', { replace: true })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id, isEdit, navigate])

  const coverDisplay = useMemo(() => {
    if (coverPreview) return coverPreview
    return coverExisting || ''
  }, [coverPreview, coverExisting])

  function onCoverChange (e) {
    const f = e.target.files?.[0]
    if (!f) return
    setCoverFile(f)
    setCoverPreview(URL.createObjectURL(f))
  }

  function addMenuFiles (files) {
    const next = files.map((file) => ({
      id: newLocalId(),
      file,
      preview: URL.createObjectURL(file),
    }))
    setMenuPending((p) => [...p, ...next])
  }

  function removeMenuPending (localId) {
    setMenuPending((p) => {
      const item = p.find((x) => x.id === localId)
      if (item?.preview) URL.revokeObjectURL(item.preview)
      return p.filter((x) => x.id !== localId)
    })
  }

  function removeMenuExisting (url) {
    setMenuExisting((list) => list.filter((u) => u !== url))
  }

  async function handleSubmit (e) {
    e.preventDefault()
    setSaving(true)
    setProgress(0)
    try {
      let coverUrl = coverExisting
      if (coverFile) {
        setProgress(10)
        coverUrl = await uploadRestaurantImage(coverFile, 'covers')
        if (coverExisting && coverExisting !== coverUrl) {
          await removeStorageObjectByPublicUrl(coverExisting)
        }
      }

      const payload = {
        name: name.trim(),
        category,
        description: description.trim() || null,
        address: address.trim(),
        reference: reference.trim() || null,
        maps_url: mapsUrl.trim() || null,
        tiktok_url: tiktokUrl.trim() || null,
        cover_image: coverUrl || null,
        rating: Math.min(5, Math.max(0, Number(rating) || 0)),
      }

      const totalUploads = menuPending.length
      const uploadedUrls = []
      for (let i = 0; i < menuPending.length; i++) {
        const pct = 10 + ((i + 1) / Math.max(totalUploads, 1)) * 75
        setProgress(Math.round(pct))
        const url = await uploadRestaurantImage(menuPending[i].file, 'menus')
        uploadedUrls.push(url)
      }

      const menuUrls = [...menuExisting, ...uploadedUrls]

      if (isEdit) {
        await adminUpdateRestaurant(id, payload, menuUrls)
        for (const item of menuPending) {
          if (item.preview) URL.revokeObjectURL(item.preview)
        }
        toast.success('Restaurante actualizado')
      } else {
        await adminCreateRestaurant(payload, menuUrls)
        for (const item of menuPending) {
          if (item.preview) URL.revokeObjectURL(item.preview)
        }
        toast.success('Restaurante creado')
      }

      setProgress(100)
      navigate('/admin/restaurants', { replace: true })
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar')
    } finally {
      setSaving(false)
      setProgress(-1)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-fuchsia-500 border-t-transparent" />
      </div>
    )
  }

  const dropItems = menuPending.map((m) => ({
    id: m.id,
    file: m.file,
    preview: m.preview,
  }))

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/restaurants"
          className="inline-flex rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Editar restaurante' : 'Nuevo restaurante'}
          </h1>
          <p className="text-sm text-slate-400">Completa los datos y sube las fotos de la carta.</p>
        </div>
      </div>

      <motion.form
        layout
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-400">Nombre</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-400">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0b0610] px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500/40"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-400">Calificación (0–5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-400">Descripción</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-400">Dirección</label>
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-400">Referencia</label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ej: frente al parque, 2do piso"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-400">
              Google Maps (enlace o embed)
            </label>
            <input
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-400">Link TikTok</label>
            <input
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@usuario/video/..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-400">Portada</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {coverDisplay && (
              <img
                src={coverDisplay}
                alt=""
                className="h-36 w-full max-w-xs rounded-2xl object-cover sm:h-28 sm:w-44"
              />
            )}
            <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Subir portada
              <input type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
            </label>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-400">
            Imágenes de la carta (puedes añadir muchas)
          </label>
          {menuExisting.length > 0 && (
            <ul className="mb-4 grid gap-2 sm:grid-cols-2">
              {menuExisting.map((url) => (
                <li
                  key={url}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2"
                >
                  <img src={url} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => removeMenuExisting(url)}
                    className="ml-auto rounded-xl px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/15"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <ImageDropzone
            files={dropItems}
            onAdd={addMenuFiles}
            onRemove={removeMenuPending}
            disabled={saving}
            progress={progress >= 0 ? progress : null}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-600/25 disabled:opacity-60 sm:w-auto sm:px-10"
        >
          <Save className="h-4 w-4" aria-hidden />
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </motion.form>
    </div>
  )
}
