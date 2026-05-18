import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { UtensilsCrossed } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { checkIsAdmin } from '../../lib/admin'
import { isSupabaseConfigured } from '../../lib/supabase'
import { APP_NAME } from '../../lib/constants'

export function AdminLogin () {
  const user = useAuthStore((s) => s.user)
  const signIn = useAuthStore((s) => s.signIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin/dashboard'

  useEffect(() => {
    let cancelled = false
    async function run () {
      if (!user) {
        setChecking(false)
        setIsAdmin(false)
        return
      }
      const ok = await checkIsAdmin()
      if (!cancelled) {
        setIsAdmin(ok)
        setChecking(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [user])

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-[#07050a] px-4 text-center text-slate-300">
        <p className="max-w-md text-sm">Configura Supabase en <code className="text-fuchsia-300">.env</code> para usar el panel.</p>
        <Link to="/" className="mt-4 text-sm font-semibold text-fuchsia-400 hover:underline">
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (checking && user) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#07050a]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-fuchsia-500 border-t-transparent" />
      </div>
    )
  }

  if (user && isAdmin) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit (e) {
    e.preventDefault()
    setBusy(true)
    try {
      await signIn(email.trim(), password)
      const ok = await checkIsAdmin()
      if (!ok) {
        toast.error('Este usuario no es administrador.')
        await useAuthStore.getState().signOut()
        return
      }
      toast.success('Bienvenido')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message || 'No se pudo iniciar sesión')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#07050a] px-4 py-10">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0610]/90 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-orange-500 shadow-lg shadow-fuchsia-500/30">
            <UtensilsCrossed className="h-6 w-6 text-white" aria-hidden />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-white">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-slate-400">Acceso solo para administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-xs font-semibold text-slate-400">
              Correo
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-fuchsia-500/40 focus:ring-fuchsia-500/25"
            />
          </div>
          <div>
            <label htmlFor="admin-pass" className="mb-1.5 block text-xs font-semibold text-slate-400">
              Contraseña
            </label>
            <input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-fuchsia-500/40 focus:ring-fuchsia-500/25"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-600/25 transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/" className="font-semibold text-fuchsia-400 hover:underline">
            ← Volver a la web pública
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
