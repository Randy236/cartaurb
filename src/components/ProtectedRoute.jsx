import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { checkIsAdmin } from '../lib/admin'

export function ProtectedRoute ({ children }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const initialized = useAuthStore((s) => s.initialized)
  const [adminOk, setAdminOk] = useState(null)
  const location = useLocation()

  useEffect(() => {
    let cancelled = false
    async function run () {
      if (!user) {
        setAdminOk(false)
        return
      }
      const ok = await checkIsAdmin()
      if (!cancelled) setAdminOk(ok)
    }
    if (initialized && !loading) run()
    return () => {
      cancelled = true
    }
  }, [user, loading, initialized])

  useEffect(() => {
    if (initialized && !loading && user && adminOk === false) {
      toast.error('Tu cuenta no tiene permisos de administrador.')
    }
  }, [initialized, loading, user, adminOk])

  if (!initialized || loading || (user && adminOk === null)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-fuchsia-500 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (adminOk === false) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
