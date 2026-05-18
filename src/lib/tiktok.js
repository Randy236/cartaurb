/**
 * Obtiene un ID de video de TikTok desde una URL pública.
 */
export function getTikTokVideoId (url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  const m = trimmed.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i)
  if (m) return m[1]
  const m2 = trimmed.match(/vm\.tiktok\.com\/([A-Za-z0-9]+)/i)
  return m2 ? m2[1] : null
}

export function getTikTokEmbedSrc (url) {
  const id = getTikTokVideoId(url)
  if (!id) return null
  return `https://www.tiktok.com/embed/v2/${id}`
}
