import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserDashboard from "./components/UserDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterTurf from "./components/RegisterTurf";
import EditTurf from "./components/EditTurf";
import Turfs from "./components/user-dashboard/Turfs";
import Players from "./components/user-dashboard/Players";
import TurfDetails from "./components/user-dashboard/TurfDetails";
import BookingDetails from "./components/user-dashboard/BookingDetails";
import SearchResults from "./components/user-dashboard/SearchResults";
import OTPVerification from "./components/OTPVerification";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import Payment from "./components/user-dashboard/Payment";

const AppRoutes = () => {
  const { authState } = useAuth(); // Use Auth Context

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      {/* Open Access Pages */}
      <Route path="/" element={<UserDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/user-dashboard/turfs" element={<Turfs />} />
      <Route path="/user-dashboard/players" element={<Players />} />
      <Route path="/user-dashboard/search-results" element={<SearchResults />} />

      {/* OTP Verification Before Booking */}
      <Route path="/otp-verification" element={<OTPVerification loginType="user" />} />

      {/* Protected Routes for Verified Users */}
      <Route
        path="/user-dashboard/userBookings"
        element={
          authState.phoneVerified ? <BookingDetails /> : <OTPVerification loginType="user" />
        }
      />
      <Route
        path="/payment"
        element={
          authState.phoneVerified ? <Payment /> : <OTPVerification loginType="user" />
        }
      />
      <Route path="/user-dashboard/turfs/:id" element={<TurfDetails />} />

      {/* Owner Dashboard (Protected) */}
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
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
        <Navbar />
        <AppRoutes />
    </AuthProvider>
  );
};

export default App;
