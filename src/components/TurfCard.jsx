import React from "react";
import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TurfCard = ({ turf }) => {
  const navigate = useNavigate();

  const handleBookClick = (id) => {
    navigate(`/user-dashboard/turfs/${id}`); // Navigate to booking page
  };

  // console.log(turf);

  // Ensure a valid image URL, replacing backslashes and handling missing images
  const turfImage = turf?.images?.[0] 
    ? `http://localhost:5000/${turf.images[0].replace(/\\/g, "/")}` 
    : "/default-turf.jpg"; // Fallback image

  return (
    <Card 
      sx={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        width: "100%", 
        borderRadius: 2, 
        boxShadow: 3, 
        overflow: "hidden", 
        borderLeft: "5px solid black",
      }}
      onClick={() => handleBookClick(turf._id)} // Make the whole card clickable
    >
      {/* Image (30% width) */}
      <CardMedia
        component="img"
        sx={{ 
          width: "30%", 
          height: 160, 
          objectFit: "cover" 
        }}
        image={turfImage}
        alt={turf.name}
      />

      {/* Content (70% width) */}
      <CardContent sx={{ width: "70%", padding: 2 }}>
        {/* Turf Name */}
        <Typography variant="h5" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
          {turf.name}
        </Typography>

        {/* Turf Location */}
        <Typography variant="h6" color="secondary">
          Location: {turf.location}
        </Typography>

        {/* Turf Price */}
        <Typography variant="h6" color="primary">
          ₹{turf.price} / hour
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TurfCard;
