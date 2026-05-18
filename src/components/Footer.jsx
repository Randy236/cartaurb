import { Link } from 'react-router-dom'
import { Heart, Sparkles } from 'lucide-react'
import { APP_NAME } from '../lib/constants'

export function Footer () {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/20">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4 text-fuchsia-400" aria-hidden />
            {APP_NAME}
          </p>
          <p className="mt-1 max-w-md text-sm text-slate-400">
            La forma más rápida de ver cartas, precios y ubicación de restaurantes en Juliaca — pensado
            para quien llega desde TikTok.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <Link to="/" className="hover:text-white">
            Inicio
          </Link>
          <Link to="/admin" className="hover:text-white">
            Panel admin
          </Link>
          <span className="inline-flex items-center gap-1 text-slate-500">
            Hecho con <Heart className="h-3.5 w-3.5 text-orange-400" aria-hidden /> en Juliaca
          </span>
        </div>
      </div>
    </footer>
  )
}
