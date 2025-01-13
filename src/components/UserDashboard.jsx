import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { SportsSoccer, Grass } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress"; // Added for better loading experience
import { AuthContext } from "../App";
 

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate(); // React Router's navigation hook
  const { authState, setAuthState } = useContext(AuthContext); // Access the authState and setAuthState from context

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth"); // If no token, redirect to login
        return;
      }

      try {
        const response = await axios.get("https://turf-backend-o0i0.onrender.com/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.removeItem("token");
          alert("Session expired. Please log in again.");
          navigate("/auth");
        } else {
          alert(error.response?.data?.message || "Failed to load dashboard");
        }
      } finally {
        setLoading(false); // Set loading state to false after fetching data
      }
    };

    fetchData();
  }, [navigate]);

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
    ); // Show loading spinner
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Logo</h2>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {data ? (
        <div className="mt-5 d-flex justify-content-around align-items-center">
          <Card sx={{ minWidth: 275, textAlign: "center", borderTop: "5px solid blue", padding: "10px 0px" }}>
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <Grass sx={{ fontSize: 50, color: "blue" }} />
            </Box>
            <CardContent>
              <Typography sx={{ color: "h3", mb: 1.5, fontWeight: "bold", fontSize: "20px" }}>Turfs</Typography>
            </CardContent>
            <Box>
              <Typography variant="h4" color="primary">
                {data.turfs.length}
              </Typography>
            </Box>
          </Card>

          <Card sx={{ minWidth: 275, textAlign: "center", borderTop: "5px solid blue", padding: "10px 0px" }}>
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <SportsSoccer sx={{ fontSize: 50, color: "blue" }} />
            </Box>
            <CardContent>
              <Typography sx={{ color: "h3", mb: 1.5, fontWeight: "bold", fontSize: "20px" }}>Players</Typography>
            </CardContent>
            <Box>
              <Typography variant="h4" color="primary">
                {data.totalPlayers?.length || 0}
              </Typography>
            </Box>
          </Card>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default UserDashboard;
