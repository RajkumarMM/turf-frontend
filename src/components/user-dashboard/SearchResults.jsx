import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress, Button } from "@mui/material";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {}; // Get search criteria
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/search", {
          params: searchParams, // Send search criteria
        });
        setResults(response.data);
      } catch (error) {
        alert("Error fetching search results");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  if (loading) return <CircularProgress />;

  return (
    <div className="container">
      <h2>Search Results</h2>
      {results && results.length > 0 ? (
        results.map((turf) => (
          <Card key={turf.id} sx={{ margin: "10px", padding: "10px" }}>
            <CardContent>
              <Typography variant="h5">{turf.name}</Typography>
              <Typography variant="body2">{turf.location}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No results found</p>
      )}
      <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
        Back
      </Button>
    </div>
  );
};

export default SearchResults;
