import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Button, TextField, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import AvailableSlots from "./AvailableSlots";
import TurfGallery from "./TurfGallery";
import TurfActions from "./TurfActions";

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
          `https://turf-backend-o0i0.onrender.com/api/turfs/${id}`,
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
    // console.log(startTime, endTime);

    const selectedStart = dayjs(`${date}T${startTime}:00`);
    const selectedEnd = dayjs(`${date}T${endTime}:00`);
    const now = dayjs();
  
    // Check if selected time is in the past
    if (selectedStart.isBefore(now)) {
      alert("Start time cannot be in the past.");
      return;
    }
    if (selectedEnd.isBefore(selectedStart)) {
      alert("End time must be later than start time.");
      return;
    }
    

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://turf-backend-o0i0.onrender.com/api/bookings/book-slot`,
        { turfId: id, date, 
          startTime, endTime,
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
      const start = dayjs(`2000-01-01T${startTime}:00`);
      const end = dayjs(`2000-01-01T${endTime}:00`);
      
      // Get total duration in minutes
      const durationMinutes = end.diff(start, "minute");
      
      // Calculate price accurately (1000 per hour, so 1000 / 60 per minute)
      const perMinuteRate = (turf?.price || 1000) / 60;
      setPrice((durationMinutes * perMinuteRate).toFixed(2));
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
const currentMinute = dayjs().minute();

// Generate time slots for every minute (24-hour format)
const availableTimes = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute++) {
    const timeValue = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const isPast = dayjs().hour(hour).minute(minute).isBefore(dayjs().hour(currentHour).minute(currentMinute));

    // Exclude past times for today
    if (!(date === today && isPast)) {
      availableTimes.push({ value: timeValue, label: timeValue });
    }
  }
}

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
  const turfAddress = `${turf.address}, ${turf.location}`;
  return (
    <Box className="container my-4">
      <Button variant="contained" color="primary" onClick={() => navigate("/user-dashboard")}>
        Back
      </Button>
      <TurfGallery turf={turf} />

      <Typography variant="h3" mt={2} textAlign="start" textTransform="capitalize">{turf.name}</Typography>
      <Typography variant="h5" textAlign="start" textTransform="capitalize">Location: {turf.address}, {turf.location}</Typography>
      <Typography variant="h5" textAlign="start" textTransform="capitalize">Price: ₹{turf.price} per hour</Typography>

      <TurfActions ownerPhone={turf.contactNumber} turfAddress={turfAddress}/>


      {/* Booking UI */}
      <AvailableSlots turfId={id} turfPrice= {turf.price} openingTime={turf.openingTime} closingTime= {turf.closingTime} />
    </Box>
  );
};

export default TurfDetails;
