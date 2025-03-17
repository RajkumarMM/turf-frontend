import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; // Import AuthContext to access authentication state
import {jwtDecode} from 'jwt-decode'; // Import jwtDecode to decode JWT tokens

const ProtectedRoute = ({ children, role }) => {
  // Access authentication state and logout function from AuthContext
  const { authState, logout } = useAuth();

  useEffect(() => {
    if (authState.token) {
      try {
        // Decode the JWT token to get its payload (including expiration time)
        const decodedToken = jwtDecode(authState.token);

        // Get the current timestamp in seconds
        const currentTime = Math.floor(Date.now() / 1000); 

        // Check if the token's expiration time is in the past
        if (decodedToken.exp < currentTime) {
          logout(); // If token is expired, log out the user
        }
      } catch (error) {
        console.error("Invalid token:", error); // Log an error if the token is invalid or cannot be decoded
        logout(); // If decoding fails, assume the token is invalid and log out the user
      }
    }
  }, [authState.token]); // Run effect when authState.token or logout function changes

  // // If user is not authenticated, redirect to login page
  // if (!authState.isAuthenticated) {
  //   return <Navigate to="/auth" />;
  // }

  // If a role is required and does not match the user's role, redirect to home
  if (role && authState.role !== role) {
    return <Navigate to="/" />;
  }

  // If authentication and role checks pass, render the protected component
  return children;
};

export default ProtectedRoute; // Export the ProtectedRoute component for use in routing
