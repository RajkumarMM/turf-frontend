import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Typography, Box, Card, CardContent, Grid } from "@mui/material";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  // State to store the payment link from the response
  const [paymentLink, setPaymentLink] = useState("");

  if (!bookingDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          No booking details available.
        </Typography>
      </Box>
    );
  }

  // Function to book slot and get payment link
  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure token is stored after login

      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/bookings/book-slot",
        bookingDetails,
        {
          headers: { Authorization: `Bearer ${token}` }, // Include JWT token
        }
      );

      alert("Slot booked successfully!");
      console.log("Booking Response:", response.data);

      // Store payment link in state
      setPaymentLink(response.data.payment_link);
      
    } catch (err) {
      console.error("Booking Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
      <Card sx={{ width: 400, p: 3, boxShadow: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Payment Details
          </Typography>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Turf:</strong> {bookingDetails.turfId}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Slot:</strong> {bookingDetails.startTime} to {bookingDetails.endTime}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="green" fontWeight="bold">
                <strong>Total Price:</strong> ₹{bookingDetails.price}
              </Typography>
            </Grid>
          </Grid>

          <Box mt={3} textAlign="center">
            {/* Show Proceed to Pay button if payment link is not received */}
            {!paymentLink && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ borderRadius: 2 }}
                onClick={handleBooking}
              >
                Proceed to Pay
              </Button>
            )}

            {/* Show Confirm Payment button when payment link is received */}
            {paymentLink && (
              <Button
                variant="contained"
                color="success"
                size="large"
                fullWidth
                sx={{ borderRadius: 2, mt: 2 }}
                onClick={() => window.open(paymentLink, "_blank")}
              >
                Confirm Payment
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Payment;
