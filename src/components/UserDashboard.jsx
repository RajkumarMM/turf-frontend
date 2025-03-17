import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, ButtonBase } from "@mui/material";
import { SportsSoccer, Grass, Preview } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../context/AuthContext";
import TurfCard from "./TurfCard";

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate(); // React Router's navigation hook
  const { authState, logout } = useAuth(); // Destructure authState and logout
  

 

  // Function to check if token is expired
  // const isTokenExpired = (token) => {
  //   try {
  //     const decoded = jwtDecode(token);
  //     return decoded.exp * 1000 < Date.now(); // Convert expiry to milliseconds
  //   } catch (error) {
  //     return true; // If decoding fails, assume token is invalid
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      // if (!authState.token || isTokenExpired(authState.token)) {
      //   logout(); // Logout the user if the token is expired
      //   navigate("/auth"); // Redirect to login if token is not found
      //   return;
      // }

      try {
        const response = await axios.get("http://localhost:5000/api/dashboard");
        setData(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired or invalid, redirect to login
          logout();
          alert("Session expired. Please log in again.");
          // navigate("/auth");
        } else {
          alert(error.response?.data?.message || "Failed to load dashboard");
        }
      } finally {
        setLoading(false); // Set loading state to false after fetching data
      }
    };

    fetchData();
  }, [authState.token, logout]);

  // const handleLogout = () => {
  //   const confirmLogout = window.confirm("Are you sure you want to log out?");
    
  //   if (confirmLogout) {
  //     logout();
  
  //     alert("You have been logged out.");
  //     // navigate("/auth"); // Redirect to login after logout
  //   } else {
  //     alert("Logout canceled.");
  //   }
  // };
  // card navigation
  // const handleCardClick = (type) => {
  //   navigate(`/user-dashboard/${type}`); // Navigate to a dynamic route
  // };

   // Search bar handler
  //  const handleSearch = () => {
  //   const today = dayjs(); // Get current date & time
  //   const selectedDate = dayjs(date, "YYYY-MM-DD"); // Parse selected date
  //   const selectedTime = dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm"); // Parse full date & time
  
  //   // Check if selected date is in the past
  //   if (selectedDate.isBefore(today.startOf("day"))) {
  //     alert("Past dates are not allowed!");
  //     return;
  //   }
  
  //   // If today’s date is selected, check if the selected time is in the past
  //   if (selectedDate.isSame(today, "day")) {
  //     const now = dayjs(); // Current date & time
  //     if (selectedTime.isBefore(now)) { // Compare actual DateTime objects
  //       alert("Past time is not allowed for today's searching!");
  //       return;
  //     }
  //   }
  
  //   // Proceed with navigation if validation passes
  //   console.log("Search Criteria:", { location, date, time, amenities, priceRange });
  //   navigate("/user-dashboard/search-results", {
  //     state: { location, date, time, amenities, priceRange },
  //   });
  // };
  


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <CircularProgress />
      </div>
    ); // Show loading spinner
  }

  return (
    <>
      
      <div className="container">
      {data ? (
        <div className="row mt-5 justify-content-center">
          {data.turfs.map((turf, index) => (
            <div className="col-8" key={index + 1}>
        <ButtonBase sx={{width: "100%", marginTop: "5px",}} >
          <TurfCard turf={turf} />
        </ButtonBase>
        </div>
      ))}
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
    </>
  );
};

export default UserDashboard;
