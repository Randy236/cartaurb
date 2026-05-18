import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  normalizeRestaurant,
  normalizeRestaurantPayload,
  normalizeRestaurants,
} from '../lib/text'

function client () {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
  }
  return supabase
}

export async function fetchRestaurants () {
  const { data, error } = await client()
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return normalizeRestaurants(data)
}

function sanitizeIlike (q) {
  return q.replace(/%/g, '').replace(/_/g, '').replace(/,/g, ' ').trim()
}

export async function searchRestaurants (query) {
  const raw = (query || '').trim()
  if (!raw) return fetchRestaurants()

  const q = sanitizeIlike(raw)
  if (!q) return fetchRestaurants()

  const pattern = `%${q}%`
  const { data, error } = await client()
    .from('restaurants')
    .select('*')
    .or(`name.ilike.${pattern},category.ilike.${pattern},address.ilike.${pattern}`)
    .order('rating', { ascending: false })
    .limit(50)

  if (error) throw error
  return normalizeRestaurants(data)
}

export async function fetchRestaurantById (id) {
  const { data: restaurant, error: rErr } = await client()
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (rErr) throw rErr
  if (!restaurant) return null

  const { data: images, error: iErr } = await client()
    .from('menu_images')
    .select('*')
    .eq('restaurant_id', id)
    .order('sort_order', { ascending: true })

  if (iErr) throw iErr
  return { ...normalizeRestaurant(restaurant), menu_images: images ?? [] }
}

export async function logVisit (restaurantId) {
  if (!isSupabaseConfigured || !supabase) return
  try {
    await supabase.from('visits').insert({ restaurant_id: restaurantId })
  } catch {
    /* noop */
  }
}

export async function fetchAdminStats () {
  const c = client()
  const [r, m, v, recent] = await Promise.all([
    c.from('restaurants').select('id', { count: 'exact', head: true }),
    c.from('menu_images').select('id', { count: 'exact', head: true }),
    c.from('visits').select('id', { count: 'exact', head: true }),
    c.from('restaurants').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  if (r.error) throw r.error
  if (m.error) throw m.error
  if (v.error) throw v.error
  if (recent.error) throw recent.error

  return {
    totalRestaurants: r.count ?? 0,
    totalImages: m.count ?? 0,
    totalVisits: v.count ?? 0,
    recentRestaurants: normalizeRestaurants(recent.data),
  }
}

export async function adminListRestaurants () {
  const { data, error } = await client()
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return normalizeRestaurants(data)
}

export async function adminCreateRestaurant (payload, menuImageUrls) {
  const c = client()
  const clean = normalizeRestaurantPayload(payload)
  const { data: row, error } = await c.from('restaurants').insert(clean).select().single()
  if (error) throw error

  if (menuImageUrls?.length) {
    const rows = menuImageUrls.map((image_url, i) => ({
      restaurant_id: row.id,
      image_url,
      sort_order: i,
    }))
    const { error: imgErr } = await c.from('menu_images').insert(rows)
    if (imgErr) throw imgErr
  }
  return normalizeRestaurant(row)
}

export async function adminUpdateRestaurant (id, payload, menuImageUrls) {
  const c = client()
  const clean = normalizeRestaurantPayload(payload)
  const { error } = await c.from('restaurants').update(clean).eq('id', id)
  if (error) throw error

  if (menuImageUrls) {
    const { error: delErr } = await c.from('menu_images').delete().eq('restaurant_id', id)
    if (delErr) throw delErr
    if (menuImageUrls.length) {
      const rows = menuImageUrls.map((image_url, i) => ({
        restaurant_id: id,
        image_url,
        sort_order: i,
      }))
      const { error: insErr } = await c.from('menu_images').insert(rows)
      if (insErr) throw insErr
    }
  }
}

export async function adminDeleteRestaurant (id) {
  const c = client()
  const { data: imgs } = await c.from('menu_images').select('image_url').eq('restaurant_id', id)
  const { error } = await c.from('restaurants').delete().eq('id', id)
  if (error) throw error
  return imgs ?? []
}
