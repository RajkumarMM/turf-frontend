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

// Create Auth Context
export const AuthContext = createContext();

const App = () => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  // Check localStorage for token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setAuthState({ token, role, isAuthenticated: true });
    }
  }, []);

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthState({ token: null, role: null, isAuthenticated: false });
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
                <RegisterTurf onSubmit={handleRegisterTurf} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
