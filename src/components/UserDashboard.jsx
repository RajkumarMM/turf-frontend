import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, ButtonBase, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { SportsSoccer, Grass, Preview } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../App";
import {jwtDecode} from 'jwt-decode'; // Import jwtDecode to decode JWT tokens
import dayjs from "dayjs";

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate(); // React Router's navigation hook
  const { authState, logout } = useContext(AuthContext); // Access the authState and setAuthState from context
  

  // States for search bar inputs
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [time, setTime] = useState("");
  const [amenities, setAmenities] = useState("Criket");
  const [priceRange, setPriceRange] = useState("1000");

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // Convert expiry to milliseconds
    } catch (error) {
      return true; // If decoding fails, assume token is invalid
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!authState.token || isTokenExpired(authState.token)) {
        logout(); // Logout the user if the token is expired
        navigate("/auth"); // Redirect to login if token is not found
        return;
      }

      try {
        const response = await axios.get("https://turf-backend-o0i0.onrender.com/api/dashboard", {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        setData(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired or invalid, redirect to login
          logout();
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
  // card navigation
  const handleCardClick = (type) => {
    navigate(`/user-dashboard/${type}`); // Navigate to a dynamic route
  };

   // Search bar handler
   const handleSearch = () => {
    const today = dayjs(); // Get current date & time
    const selectedDate = dayjs(date, "YYYY-MM-DD"); // Parse selected date
    const selectedTime = dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm"); // Parse full date & time
  
    // Check if selected date is in the past
    if (selectedDate.isBefore(today.startOf("day"))) {
      alert("Past dates are not allowed!");
      return;
    }
  
    // If today’s date is selected, check if the selected time is in the past
    if (selectedDate.isSame(today, "day")) {
      const now = dayjs(); // Current date & time
      if (selectedTime.isBefore(now)) { // Compare actual DateTime objects
        alert("Past time is not allowed for today's searching!");
        return;
      }
    }
  
    // Proceed with navigation if validation passes
    console.log("Search Criteria:", { location, date, time, amenities, priceRange });
    navigate("/user-dashboard/search-results", {
      state: { location, date, time, amenities, priceRange },
    });
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
      {/* Search Bar Section */}
      <div className="mt-4 p-3 bg-light shadow rounded">
        <h4>Search Turfs</h4>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <TextField
            label="Location"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            size="small"
          />
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Time"
            type="time"
            variant="outlined"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Amenities</InputLabel>
            <Select
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              label="Amenities"
            >
              <MenuItem value="Criket">Cricket</MenuItem>
              <MenuItem value="Football">Football</MenuItem>
              <MenuItem value="Tennis">Tennis</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Price Range</InputLabel>
            <Select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              label="Price Range"
            >
              <MenuItem value="1000">Low</MenuItem>
              <MenuItem value="2000">Medium</MenuItem>
              <MenuItem value="3000">High</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {data ? (
        <div className="mt-5 d-flex justify-content-around align-items-center">
          <ButtonBase onClick={() => handleCardClick("turfs")} >
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
          </ButtonBase>
          <ButtonBase onClick={() => handleCardClick("players")} >
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
          </ButtonBase>
          <ButtonBase onClick={() => handleCardClick("userBookings")} >
          <Card sx={{ minWidth: 275, textAlign: "center", borderTop: "5px solid blue", padding: "10px 0px" }}>
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <Preview sx={{ fontSize: 50, color: "blue" }} />
            </Box>
            <CardContent>
              <Typography sx={{ color: "h3", mb: 1.5, fontWeight: "bold", fontSize: "20px" }}>View Your Bookings</Typography>
            </CardContent>
            <Box>
              <Typography variant="h4" color="primary">
                
              </Typography>
            </Box>
          </Card>
          </ButtonBase>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default UserDashboard;
