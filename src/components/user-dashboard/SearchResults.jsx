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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

const SearchResults = ({ onSearch }) => {
  // const navigate = useNavigate();
  // const [results, setResults] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const { authState } = useAuth();
  
  

  // States for search bar inputs
  // const [location, setLocation] = useState("");
  // const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  // const [time, setTime] = useState("");
  // const [amenities, setAmenities] = useState("Cricket");
  // const [priceRange, setPriceRange] = useState("1000");
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  // const handleSearch = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const today = dayjs();
  //   const selectedDate = dayjs(date, "YYYY-MM-DD");
  //   const selectedTime = dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm");

  //   if (selectedDate.isBefore(today.startOf("day"))) {
  //     alert("Past dates are not allowed!");
  //     return;
  //   }
  //   if (selectedDate.isSame(today, "day")) {
  //     const now = dayjs();
  //     if (selectedTime.isBefore(now)) {
  //       alert("Past time is not allowed for today's searching!");
  //       return;
  //     }
  //   }
  //   try {
  //     console.log(location, date, time, amenities, priceRange);
  //     const response = await axios.get("http://localhost:5000/api/search", {
  //       params: { location, date, time, amenities, priceRange },
  //     });
  //     setResults(response.data);
  //     console.log(results);
  //   } catch (error) {
  //     alert("Error fetching search results");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Box
      className="container p-1"
      sx={{
        backgroundColor: "black",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 255, 0, 0.2)",
      }}
    >
      {/* <Typography
        variant="h4"
        color="white"
        textAlign="center"
        sx={{ textDecoration: "underline", marginBottom: "10px" }}
      >
        Search Turfs
      </Typography> */}
      <Box
        className="d-flex flex-wrap justify-content-center gap-3"
        sx={{ padding: "10px" }}
      >
        <TextField
          label="Search Venues"
          variant="outlined"
          value={query}
          onChange={handleChange}
          size="small"
          sx={{
            bgcolor: "black",
            borderRadius: "5px",
            input: { color: "white" },
            "& label": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "green" },
              "&:hover fieldset": { borderColor: "#00ff00" },
              "&.Mui-focused fieldset": { borderColor: "green" },
            },
          }}
        />
        {/* <TextField
          label="Date"
          type="date"
          variant="outlined"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
          sx={{
            bgcolor: "black",
            borderRadius: "5px",
            input: { color: "white" },
            "& label": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "green" },
              "&:hover fieldset": { borderColor: "#00ff00" },
              "&.Mui-focused fieldset": { borderColor: "green" },
            },
          }}
          InputLabelProps={{ shrink: true }}
        /> */}
        {/* <TextField
          label="Time"
          type="time"
          variant="outlined"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          size="small"
          sx={{
            bgcolor: "black",
            borderRadius: "5px",
            input: { color: "white" },
            "& label": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "green" },
              "&:hover fieldset": { borderColor: "#00ff00" },
              "&.Mui-focused fieldset": { borderColor: "green" },
            },
          }}
          InputLabelProps={{ shrink: true }}
        /> */}
        {/* <FormControl size="small" sx={{ minWidth: 120, bgcolor: "black", borderRadius: "5px" }}>
          <InputLabel sx={{ color: "white" }}>Amenities</InputLabel>
          <Select
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            label="Amenities"
            sx={{
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "green" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00ff00" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "green" },
            }}
          >
            <MenuItem value="Cricket">Cricket</MenuItem>
            <MenuItem value="Football">Football</MenuItem>
            <MenuItem value="Tennis">Tennis</MenuItem>
          </Select>
        </FormControl> */}
        {/* <FormControl size="small" sx={{ minWidth: 130, bgcolor: "black", borderRadius: "5px" }}>
          <InputLabel sx={{ color: "white" }}>Price Range</InputLabel>
          <Select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            label="Price Range"
            sx={{
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "green" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00ff00" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "green" },
            }}
          >
            <MenuItem value="1000">Low</MenuItem>
            <MenuItem value="2000">Medium</MenuItem>
            <MenuItem value="3000">High</MenuItem>
          </Select>
        </FormControl> */}
        {/* <Button
          variant="contained"
          sx={{
            bgcolor: "green",
            color: "white",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#008000" },
          }}
          onClick={handleSearch}
        >
          Search
        </Button> */}
      </Box>
    </Box>
  );
};

export default SearchResults;
