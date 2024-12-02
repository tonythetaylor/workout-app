// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute: React.FC = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
