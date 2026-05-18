import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { useAuthStore } from './store/authStore'

export function Bootstrap () {
  const init = useAuthStore((s) => s.init)
  useEffect(() => {
    init()
  }, [init])
  return (
    <>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'text-sm',
          style: {
            background: '#120a1a',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </>
  )
}
