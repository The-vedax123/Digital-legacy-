import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Vault from './pages/Vault'
import Memories from './pages/Memories'
import Capsules from './pages/Capsules'
import Circle from './pages/Circle'
import Echo from './pages/Echo'
import Emergency from './pages/Emergency'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="vault" element={<Vault />} />
        <Route path="memories" element={<Memories />} />
        <Route path="capsules" element={<Capsules />} />
        <Route path="circle" element={<Circle />} />
        <Route path="echo" element={<Echo />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
