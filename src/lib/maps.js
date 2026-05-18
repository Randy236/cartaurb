/**
 * Devuelve URL lista para iframe de Google Maps.
 * Acepta URLs embed o enlaces normales (intenta convertir a embed).
 */
export function toMapsEmbedSrc (mapsUrl) {
  if (!mapsUrl || typeof mapsUrl !== 'string') return null
  const u = mapsUrl.trim()
  if (u.includes('google.com/maps/embed')) return u
  const q = encodeURIComponent(u)
  return `https://maps.google.com/maps?q=${q}&output=embed`
}
