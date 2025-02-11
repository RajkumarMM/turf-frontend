import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Button, TextField, MenuItem } from "@mui/material";
import dayjs from "dayjs";

const TurfDetails = () => {
  const { id } = useParams();
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/turfs/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTurf(response.data);
      } catch (error) {
        console.error("Error fetching turf details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfDetails();
  }, [id]);

  const handleBooking = async () => {
    if (!date || !startTime || !endTime) {
      alert("Please select date, start time, and end time.");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be later than start time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/bookings/book-slot`,
        { turfId: id, date, 
          startTime: `${startTime}:00`, endTime: `${endTime}:00`,
           price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Slot booked successfully!");
    } catch (error) {
      alert("Error booking slot: " + error.response?.data?.message || error.message);
    }
  };

  const calculatePrice = () => {
    if (startTime && endTime && startTime < endTime) {
      const hours = parseInt(endTime) - parseInt(startTime);
      setPrice(hours * (turf?.price || 0));
    } else {
      setPrice(0);
    }
  };

  useEffect(() => {
    calculatePrice();
    console.log(startTime, endTime);
    
  }, [startTime, endTime]);

  const today = dayjs().format("YYYY-MM-DD");
  const currentHour = dayjs().hour();

  const availableTimes = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString().padStart(2, "0"),
    label: `${i.toString().padStart(2, "0")}:00`,
  }));

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
    <Box className="container my-4">
      <Button variant="contained" color="primary" onClick={() => navigate("/user-dashboard/turfs")}>
        Back
      </Button>

      <Typography variant="h4" mt={2} textAlign="center">{turf.name}</Typography>
      <Typography variant="h6" textAlign="center">Location: {turf.location}</Typography>
      <Typography variant="h6" textAlign="center">Price: ₹{turf.price} per hour</Typography>

      {/* Display Turf Images */}
      <Typography variant="h6" mt={2} textAlign="center">Images of {turf.name}</Typography>
      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
        {turf.images?.length > 0 ? (
          turf.images.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:5000/${image}`}
              alt={`Turf ${index + 1}`}
              style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "10px" }}
            />
          ))
        ) : (
          <Typography variant="body1">No images available</Typography>
        )}
      </Box>

      {/* Booking UI */}
      <Typography variant="h5" mt={4} textAlign="center">Book a Slot</Typography>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
        {/* Date Picker */}
        <TextField
  label="Select Date"
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  InputProps={{ inputProps: { min: today } }}
  fullWidth
  defaultValue={today} // Ensures default date appears
  helperText="Choose a date for booking" // Acts like a placeholder
/>


        {/* Start Time */}
        <TextField
          select
          label="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          fullWidth
        >
          {availableTimes
            .filter((time) => date !== today || parseInt(time.value) >= currentHour)
            .map((time) => (
              <MenuItem key={time.value} value={time.value}>
                {time.label}
              </MenuItem>
            ))}
        </TextField>

        {/* End Time */}
        <TextField
          select
          label="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          fullWidth
        >
          {availableTimes
            .filter((time) => time.value > startTime)
            .map((time) => (
              <MenuItem key={time.value} value={time.value}>
                {time.label}
              </MenuItem>
            ))}
        </TextField>

        {/* Price Display */}
        <Typography variant="h6">Total Price: ₹{price}</Typography>

        {/* Booking Button */}
        <Button variant="contained" color="success" onClick={handleBooking}>
          Book Now
        </Button>
      </Box>
    </Box>
  );
};

export default TurfDetails;
