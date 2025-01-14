import React, { useState, useEffect, useContext } from 'react';
import TurfList from './TurfList';
import axios from 'axios';
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress"; // Loading spinner
import { AuthContext } from "../App";

function OwnerDashboard() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate(); // React Router's navigation hook
  const { authState, setAuthState } = useContext(AuthContext); // Access the authState and setAuthState from context

  const fetchTurfs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth"); // Redirect to login if token is not found
      return;
    }

    try {
        const response = await axios.get('https://turf-backend-o0i0.onrender.com/api/getOwnerTurfs', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTurfs(response.data);
    } catch (error) {
        console.error('Error fetching turfs:', error.response?.data || error.message);
        alert("Failed to load turfs. Please try again.");
    } finally {
        setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
      fetchTurfs();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      // Clear token and role from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
  
      // Reset authState in context
      setAuthState({
        token: null,
        role: null,
        isAuthenticated: false,
      });
  
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
