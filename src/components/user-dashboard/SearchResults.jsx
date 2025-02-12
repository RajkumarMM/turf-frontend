import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {}; // Get search criteria
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authState} = useContext(AuthContext); // Access the authState and setAuthState from context

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/search", {
          params: searchParams, // Send search criteria
          headers: {
            Authorization: `Bearer ${authState.token}`, // Attach token in the header
          },
        });
        // console.log(response.data);

        setResults(response.data);
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </div>
    );

  return (
    <Box className="container mt-4">
      <Typography variant="h4" mb={2} textAlign="center">
        Search Results
      </Typography>
      <button
        type="button"
        className="btn btn-primary mb-2"
        onClick={() => navigate("/user-dashboard")}
      >
        Back
      </button>
      <div className="row gap-1 justify-content-evenly align-items-center">
        {results && results.length > 0 ? (
          results.map((turf, index) => (
            <Card
              key={index}
              className="col-md-4 mb-3 text-center"
              style={{ padding: "10px" }}
            >
              <CardContent>
                <h4 className="text-center text-decoration-underline">
                  {turf.name}
                </h4>
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
          <Typography variant="h6" color="textSecondary" textAlign="center">
            No Result found.
          </Typography>
        )}
      </div>
    </Box>
  );
};

export default SearchResults;
