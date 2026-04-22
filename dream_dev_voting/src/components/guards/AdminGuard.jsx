import { Navigate, Outlet } from 'react-router-dom';

export default function AdminGuard() {
  const electorateId = localStorage.getItem('electorateId');
  if (!electorateId) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
