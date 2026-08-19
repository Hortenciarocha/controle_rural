import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { PageLoader } from '@/components/ui/PageLoader'

export function ProtectedRoute() {
  const { session, carregando } = useAuth()

  if (carregando) return <PageLoader />
  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
