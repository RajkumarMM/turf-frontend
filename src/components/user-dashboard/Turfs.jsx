import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Turfs = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurfs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("https://turf-backend-o0i0.onrender.com/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const {turfs} = response.data;
        
        setTurfs(turfs); // Assuming the API returns an array of turfs
      } catch (error) {
        alert("Failed to load turfs: " + error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box className="container mt-4">
      <Typography variant="h4" mb={2} textAlign="center">
        Available Turfs
      </Typography>
      <button
                type="button"
                className="btn btn-primary mb-2"
                onClick={() => navigate("/user-dashboard")}
            >
                Back
            </button>
      <div className="row gap-1 justify-content-evenly align-items-center">
        {turfs.length > 0 ? (
          turfs.map((turf) => (
            <Card key={turf.id} className="col-md-4 mb-3 text-center" style={{ padding: "10px" }}>
              <CardContent>
                <h4 className="text-center text-decoration-underline">{turf.name}</h4>
                <h5>Location: {turf.location}</h5>
                <h5>Price: {turf.price} per hour</h5>
                <button className="btn btn-primary"
                 onClick={() => navigate(`/user-dashboard/turfs/${turf._id}`)}
                >View & Book</button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary" textAlign="center">
            No turfs available.
          </Typography>
        )}
      </div>
    </Box>
  );
};

export default Turfs;
