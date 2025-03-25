import React from "react";
import { Card, CardContent, Typography, CardMedia, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AddBox, SportsCricket, SportsSoccer, SportsTennis } from "@mui/icons-material";
import { motion } from "framer-motion";

const TurfCard = ({ turf }) => {
  const navigate = useNavigate();

  const handleBookClick = (id) => {
    navigate(`/user-dashboard/turfs/${id}`);
  };

  const turfImage = turf?.images?.[0]
    ? `https://turf-backend-o0i0.onrender.com/${turf.images[0].replace(/\\/g, "/")}`
    : "/default-turf.jpg";

  // Function to truncate combined name & location within 15 characters
  const truncateCombinedText = (name, location, limit) => {
    let combinedText = `${name}, ${location}`;
    return combinedText.length > limit ? combinedText.substring(0, limit) + "..." : combinedText;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02}} // Smooth hover scale & slight rotation
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
          backgroundColor: "black",
          color: "#fff",
          cursor: "pointer",
        }}
        onClick={() => handleBookClick(turf._id)}
      >
        {/* Image with Animated Chips */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            sx={{ height: 180, objectFit: "cover" }}
            image={turfImage}
            alt={turf.name}
          />

          {/* Sports Chips with Entry Animation */}
          <Box
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              gap: 8,
            }}
          >
            {turf.sports?.cricket && (
              <Chip icon={<SportsCricket />} label="Cricket" variant="filled" color="success" />
            )}
            {turf.sports?.football && (
              <Chip icon={<SportsSoccer />} label="Football" variant="filled" color="success" />
            )}
            {turf.sports?.tennis && (
              <Chip icon={<SportsTennis />} label="Tennis" variant="filled" color="success" />
            )}
          </Box>
        </Box>

        {/* Card Content */}
        <CardContent sx={{ padding: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
            {truncateCombinedText(turf.name, turf.location, 15)}
          </Typography>

          {/* Price & Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Chip label="Non AC" sx={{ backgroundColor: "#6c757d", color: "#fff", fontSize: 12 }} />
            <Typography variant="body1" sx={{ color: "#ffc107" }}>
              ₹{turf.price} / hour
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TurfCard;
