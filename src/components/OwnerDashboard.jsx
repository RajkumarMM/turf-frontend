import React, { useState, useEffect, useContext } from 'react';
import TurfList from './TurfList';
import axios from 'axios';
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress"; // Loading spinner
import { AuthContext } from "../App";
import {jwtDecode} from 'jwt-decode'; // Import jwtDecode to decode JWT tokens

function OwnerDashboard() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate(); // React Router's navigation hook
  const { authState, setAuthState, logout } = useContext(AuthContext); // Access the authState and setAuthState from context

  // Function to check if token is expired
    const isTokenExpired = (token) => {
      try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now(); // Convert expiry to milliseconds
      } catch (error) {
        return true; // If decoding fails, assume token is invalid
      }
    };

  const fetchTurfs = async () => {
    if (!authState.token || isTokenExpired(authState.token)) {
      logout(); // Logout the user if the token is expired
      navigate("/auth"); // Redirect to login if token is not found
      return;
    }

    try {
        const response = await axios.get('https://turf-backend-o0i0.onrender.com/api/getOwnerTurfs', {
            headers: {
                Authorization: `Bearer ${authState.token}`,
            },
        });
        setTurfs(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        logout();
        alert("Session expired. Please log in again.");
        navigate("/auth");
      } else {
        alert(error.response?.data?.message || "Failed to load dashboard");
      }
        // console.error('Error fetching turfs:', error.response?.data || error.message);
        // alert("Failed to load turfs. Please try again.");
    } finally {
        setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
      fetchTurfs();
  }, [authState.token, logout]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      logout();
      alert("You have been logged out.");
      navigate("/auth"); // Redirect to login after logout
    } else {
      alert("Logout canceled.");
    }
  };
  

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <CircularProgress />
      </div>
    ); // Show loading spinner while data is being fetched
  }

  return (
    <div className="container">
      <div className='d-flex justify-content-between align-items-center'>
        <h1>Owner Dashboard</h1>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Button
            variant="contained"
            color="primary"
            className="mb-2"
            onClick={() => navigate("/register-turf")}
          >
            Register Turf
          </Button>
      <TurfList turfs={turfs} />
    </div>
  );
}

export default OwnerDashboard;
