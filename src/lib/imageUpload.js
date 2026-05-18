import imageCompression from 'browser-image-compression'
import { supabase, isSupabaseConfigured } from './supabase'
import { STORAGE_BUCKET } from './constants'

const compressionOptions = {
  maxSizeMB: 1.2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
}

export async function compressImage (file) {
  if (!file?.type?.startsWith('image/')) return file
  try {
    return await imageCompression(file, compressionOptions)
  } catch {
    return file
  }
}

function safeFileName (originalName) {
  const ext = (originalName.split('.').pop() || 'jpg').toLowerCase()
  const base = crypto.randomUUID()
  return `${base}.${ext === 'jpeg' ? 'jpg' : ext}`
}

/**
 * Sube un archivo al bucket y devuelve la URL pública.
 */
export async function uploadRestaurantImage (file, folder = 'menus') {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase no está configurado')
  }
  const compressed = await compressImage(file)
  const path = `${folder}/${safeFileName(file.name)}`

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, compressed, {
      cacheControl: '3600',
      upsert: false,
      contentType: compressed.type || 'image/jpeg',
    })

  if (error) throw error

  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path)
  return pub.publicUrl
}

export async function removeStorageObjectByPublicUrl (publicUrl) {
  if (!isSupabaseConfigured || !supabase || !publicUrl) return
  const marker = `/object/public/${STORAGE_BUCKET}/`
  const i = publicUrl.indexOf(marker)
  if (i === -1) return
  const path = publicUrl.slice(i + marker.length)
  await supabase.storage.from(STORAGE_BUCKET).remove([path])
}
