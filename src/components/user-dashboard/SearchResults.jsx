import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Box,
  MenuItem, Select, InputLabel, FormControl,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

const SearchResults = () => {
  const navigate = useNavigate();
  // const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();

   // States for search bar inputs
   const [location, setLocation] = useState("");
   const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
   const [time, setTime] = useState("");
   const [amenities, setAmenities] = useState("Criket");
   const [priceRange, setPriceRange] = useState("1000");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    try {
      console.log(location, date, time, amenities, priceRange);
      
      const response = await axios.get("http://localhost:5000/api/search", {
        params: {location, date, time, amenities, priceRange }});
      setResults(response.data);
      console.log(results);
      
    } catch (error) {
      alert("Error fetching search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="container mt-4">
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
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <CircularProgress />
        </div>
      )}
      <div className="row gap-1 justify-content-evenly align-items-center mt-4">
        {results && results.length > 0 ? (
          results.map((turf, index) => (
            <Card key={index} className="col-md-4 mb-3 text-center" style={{ padding: "10px" }}>
              <CardContent>
                <h4 className="text-center text-decoration-underline">{turf.name}</h4>
                <h5>Location: {turf.location}</h5>
                <h5>Price: {turf.price} per hour</h5>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/user-dashboard/turfs/${turf._id}`)}
                >
                  View & Book
                </button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography className="mt-4" variant="h6" color="textSecondary" textAlign="center">
            No results found.
          </Typography>
        )}
      </div>
    </Box>
  );
};

export default SearchResults;
