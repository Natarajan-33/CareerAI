import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/rootStore';

const ProtectedRoute = observer(() => {
  const { authStore } = useStores();
  
  // If the authentication is still being checked, show a loading indicator
  if (authStore.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not logged in, redirect to login page
  if (!authStore.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If logged in, render the child routes
  return <Outlet />;
});

export default ProtectedRoute;
