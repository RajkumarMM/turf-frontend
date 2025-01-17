import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Card, CardContent } from "@mui/material";

const Turfs = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurfs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("https://turf-backend-o0i0.onrender.com/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const {turfs, totalPlayers} = response.data;
        
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
      <div className="row gap-1 justify-content-evenly align-items-center">
        {turfs.length > 0 ? (
          turfs.map((turf) => (
            <Card key={turf.id} className="col-md-4 mb-3" style={{ padding: "10px" }}>
              <CardContent>
                <h4 className="text-center text-decoration-underline">{turf.name}</h4>
                <h5>Location: {turf.location}</h5>
                <h5>Price: {turf.price} per hour</h5>
                <h5>Timings: {turf.timings && turf.timings.length > 0 ? (
                                        turf.timings.map((time, i) => (
                                            <span
                                                key={i}
                                                className="badge badge-info mx-1"
                                                style={{ backgroundColor: '#17a2b8', color: '#fff' }}
                                            >
                                                {time}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-muted">No timings available</span>
                                    )}</h5>
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
