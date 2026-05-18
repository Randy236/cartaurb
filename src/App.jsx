import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { RestaurantDetail } from './pages/RestaurantDetail'
import { NotFound } from './pages/NotFound'
import { AdminLogin } from './pages/admin/AdminLogin'
import { Dashboard } from './pages/admin/Dashboard'
import { RestaurantsAdmin } from './pages/admin/RestaurantsAdmin'
import { RestaurantEditor } from './pages/admin/RestaurantEditor'

export default function App () {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="restaurants" element={<RestaurantsAdmin />} />
        <Route path="restaurants/new" element={<RestaurantEditor />} />
        <Route path="restaurants/:id/edit" element={<RestaurantEditor />} />
      </Route>

      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="restaurant/:id" element={<RestaurantDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
