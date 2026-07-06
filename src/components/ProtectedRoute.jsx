import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ session, children, adminOnly = false, role }) {
  if (!session) return <Navigate to="/login" replace />
  if (adminOnly && role !== 'admin') return <Navigate to="/tablon" replace />
  return children
}