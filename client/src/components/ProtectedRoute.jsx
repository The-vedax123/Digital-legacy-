import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" showText={false} />
          <div className="h-1 w-32 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-gradient" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" state={{ from: location.pathname }} replace />

  return children
}
