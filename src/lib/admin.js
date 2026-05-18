import { supabase, isSupabaseConfigured } from './supabase'

export async function checkIsAdmin () {
  if (!isSupabaseConfigured || !supabase) return false
  const { data, error } = await supabase.rpc('is_admin')
  if (error) return false
  return Boolean(data)
}
