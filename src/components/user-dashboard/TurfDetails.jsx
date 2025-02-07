import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Button } from "@mui/material";

const TurfDetails = () => {
  const { id } = useParams(); // Get the turf ID from the URL
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://turf-backend-o0i0.onrender.com/api/turfs/${id}`, // Adjust endpoint as per backend
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTurf(response.data); 
setSlots(response.data.slots || []); 
      } catch (error) {
        console.error("Error fetching turf details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfDetails();
  }, [id]);

  const handleSlotBooking = async (slot) => {
    console.log(slot);
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://turf-backend-o0i0.onrender.com/api/bookings/book-slot`,
        { turfId: id, slot },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Slot booked successfully!");
      // Update slot state to reflect booking
      setSlots((prevSlots) =>
        prevSlots.map((s) =>
          s === slot ? { ...s, isBooked: true } : s
        )
      );
    } catch (error) {
      alert("Error booking slot: " + error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  if (!turf) {
    return (
      <Typography variant="h5" color="error" textAlign="center">
        Turf details not found!
      </Typography>
    );
  }

  return (
    <Box className="container mt-4">
      <Typography variant="h4" mb={2} textAlign="center">
        {turf.name}
      </Typography>
      <Typography variant="h6" mb={2} textAlign="center">
        Location: {turf.location}
      </Typography>
      <Typography variant="h6" mb={4} textAlign="center">
        Price: {turf.price} per hour
      </Typography>
      <Typography variant="h5" mb={3}>
        Available Slots:
      </Typography>
      <div className="row gap-3">
        {slots.map((slot, index) => (
          <Button
            key={index}
            variant="contained"
            color={slot.isBooked ? "secondary" : "primary"}
            disabled={slot.isBooked}
            onClick={() => handleSlotBooking(slot)}
          >
            {slot.isBooked ? "Booked" : `Slot ${index + 1}: ${slot.time}`}
          </Button>
        ))}
      </div>
    </Box>
  );
};

export default TurfDetails;
