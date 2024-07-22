// src/guard/ProviderRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProviderRoute = () => {
  const { isAuthenticated , user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && !user.providerId) {
    return <Navigate to="/unauthorized" />; // or any other appropriate route
  }

  return <Outlet />;
};

export default ProviderRoute;
