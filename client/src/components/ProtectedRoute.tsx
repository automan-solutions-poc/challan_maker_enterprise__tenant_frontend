import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRole: 'admin' | 'tenant';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
  const { role, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  
  if (role !== allowedRole) {
    return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
