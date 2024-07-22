import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { hasProfile } from '../services/auth';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasUserProfile, setHasUserProfile] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const profileExists = await hasProfile();
        setHasUserProfile(profileExists);
      } catch (error) {
        console.error("Failed to check profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      checkUserProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading spinner if needed
  }

  return hasUserProfile ? <Outlet /> : <Navigate to='/createProfile' />;
};

export default PrivateRoute;
