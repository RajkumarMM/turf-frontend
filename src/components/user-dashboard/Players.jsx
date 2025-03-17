import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Card, CardContent } from "@mui/material";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const {turfs, totalPlayers} = response.data;
        setPlayers(totalPlayers); // Assuming the API returns an array of players
      } catch (error) {
        alert("Failed to load players: " + error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
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
        Active Players
      </Typography>
      <div className="row gap-1 justify-content-evenly align-items-center">
        {players.length > 0 ? (
          players.map((player) => (
            <Card key={player.id} className="col-md-4 mb-3 shadow-lg" style={{ padding: "10px" }}>
              <CardContent>
                <Typography variant="h6">{player.name}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary" textAlign="center">
            No players available.
          </Typography>
        )}
      </div>
    </Box>
  );
};

export default Players;
