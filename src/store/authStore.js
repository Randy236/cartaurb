import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),

  init: async () => {
    if (!isSupabaseConfigured || !supabase) {
      set({ user: null, loading: false, initialized: true })
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false, initialized: true })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  signIn: async (email, password) => {
    if (!supabase) throw new Error('Supabase no configurado')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    set({ user: data.user })
    return data.user
  },

  signOut: async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
