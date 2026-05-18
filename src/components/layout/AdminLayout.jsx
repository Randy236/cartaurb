import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AdminSidebar } from '../admin/AdminSidebar'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export function AdminLayout () {
  const [mobileOpen, setMobileOpen] = useState(false)
  const signOut = useAuthStore((s) => s.signOut)
  const navigate = useNavigate()

  async function handleSignOut () {
    await signOut()
    toast.success('Sesión cerrada')
    navigate('/admin/login', { replace: true })
    setMobileOpen(false)
  }

  return (
    <div className="flex min-h-svh bg-[#07050a] text-white">
      <div className="hidden md:block">
        <AdminSidebar onSignOut={handleSignOut} collapsed={false} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full w-[min(88vw,280px)] border-r border-white/10 bg-[#0b0610] shadow-2xl">
            <AdminSidebar onSignOut={handleSignOut} collapsed={false} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-[#0b0610]/90 px-4 py-3 backdrop-blur-xl md:hidden">
          <span className="text-sm font-bold">Admin</span>
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 p-2"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
