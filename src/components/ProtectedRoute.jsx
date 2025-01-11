import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Import AuthContext

const ProtectedRoute = ({ children, role }) => {
  const { authState } = useContext(AuthContext); // Access the authState from context

  if (!authState.isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth" />;
  }

  if (role && authState.role !== role) {
    // If the role doesn't match, redirect to a default page or home
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
