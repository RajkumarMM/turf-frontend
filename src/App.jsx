import React, { createContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Auth from "./components/Auth";
import UserDashboard from "./components/UserDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterTurf from "./components/RegisterTurf";
import EditTurf from "./components/EditTurf";
import Turfs from "./components/user-dashboard/Turfs";
import Players from "./components/user-dashboard/Players";
import TurfDetails from "./components/user-dashboard/TurfDetails";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode to decode the token
import BookingDetails from "./components/user-dashboard/BookingDetails";
import SearchResults from "./components/user-dashboard/SearchResults";

// Create Auth Context
export const AuthContext = createContext();

const App = () => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  // Function to check token expiration
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token); // Decode the token to get expiration time
      const currentTime = Date.now() / 1000; // Convert current time to seconds
      return decoded.exp < currentTime; // Check if the token is expired
    } catch (error) {
      return true; // If there's an error decoding, treat it as expired
    }
  };

  // Check localStorage for token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (isTokenExpired(token)) {
        logout(); // If the token is expired, log the user out
      } else {
        setAuthState({ token, role, isAuthenticated: true });
      }
    }
  }, []);

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    localStorage.removeItem("role"); // Remove role from local storage
    setAuthState({ token: null, role: null, isAuthenticated: false }); // Update auth state
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      <Router>
        <Routes>
          {/* Default route redirects to Auth */}
          <Route path="/" element={<Navigate to="/auth" />} />

          {/* Authentication Route */}
          <Route path="/auth" element={<Auth />} />

          {/* User Dashboard with role-based protection */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute role="player">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard/turfs"
            element={
              <ProtectedRoute role="player">
                <Turfs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard/players"
            element={
              <ProtectedRoute role="player">
                <Players />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard/userBookings"
            element={
              <ProtectedRoute role="player">
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard/search-results"
            element={
              <ProtectedRoute role="player">
                <SearchResults />
              </ProtectedRoute>
            }
          />

          {/* Owner Dashboard with role-based protection */}
          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute role="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-turf"
            element={
              <ProtectedRoute role="owner">
                <RegisterTurf />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-turf/:id"
            element={
              <ProtectedRoute role="owner">
                <EditTurf />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard/turfs/:id"
            element={
              <ProtectedRoute role="player">
                <TurfDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
