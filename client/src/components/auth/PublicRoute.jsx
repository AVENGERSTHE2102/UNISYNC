import { Navigate, Outlet } from 'react-router-dom';

function PublicRoute() {
  const token = localStorage.getItem('token') || localStorage.getItem('backendToken');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
