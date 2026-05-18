/** Detecta texto UTF-8 leído como Latin-1 (ej. GalerÃ­a → Galería). */
const MOJIBAKE = /Ã|â€|â†|Â/

export function fixMojibake (value) {
  if (value == null || typeof value !== 'string') return value
  if (!MOJIBAKE.test(value)) return value
  try {
    const bytes = Uint8Array.from(value, (c) => c.charCodeAt(0) & 0xff)
    const fixed = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
    return MOJIBAKE.test(fixed) ? value : fixed
  } catch {
    return value
  }
}

const RESTAURANT_TEXT_FIELDS = [
  'name',
  'category',
  'description',
  'address',
  'reference',
]

export function normalizeRestaurant (row) {
  if (!row || typeof row !== 'object') return row
  const out = { ...row }
  for (const key of RESTAURANT_TEXT_FIELDS) {
    if (typeof out[key] === 'string') out[key] = fixMojibake(out[key])
  }
  return out
}

export function normalizeRestaurants (rows) {
  return (rows ?? []).map(normalizeRestaurant)
}

export function normalizeRestaurantPayload (payload) {
  if (!payload || typeof payload !== 'object') return payload
  const out = { ...payload }
  for (const key of RESTAURANT_TEXT_FIELDS) {
    if (typeof out[key] === 'string') out[key] = fixMojibake(out[key])
  }
  return out
}
