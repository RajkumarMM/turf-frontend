import React, { useState } from "react";
import {
  Toolbar,
  Typography,
  AppBar,
  Avatar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TurfLogo from "../assets/images/turf-logo2.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth to access auth state

function Navbar() {
  const navigate = useNavigate();
  const { authState, logout } = useAuth(); // Get authentication state and logout function
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
    setDrawerOpen(false);
    navigate("/"); // Redirect to home after logout
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#212121" }}>
        <Toolbar>
          {/* Logo and Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <img
              src={TurfLogo}
              alt="Logo"
              style={{
                height: "80px",
                verticalAlign: "middle",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            />
            Turf Booking
          </Typography>

          {/* Search Button */}
          <Button
            color="secondary"
            variant="contained"
            onClick={() => navigate("/user-dashboard/search-results")}
            sx={{ marginRight: "20px", minWidth: "40px", padding: "8px" }}
          >
            <SearchIcon />
          </Button>

          {/* Owner Login Button (Only if not logged in) */}
          {!authState.isAuthenticated && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate("/otp-verification", { state: { loginType: "owner" } })}
            >
              Owner Login
            </Button>
          )}

          {/* Profile Button */}
          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer (Profile Menu) */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          <ListItem>
            <Avatar sx={{ marginRight: "10px" }}>
              <AccountCircleIcon />
            </Avatar>
            <ListItemText
              primary={authState.isAuthenticated ? `Welcome, ${authState.user.name}` : "Guest User"}
              secondary={authState.isAuthenticated ? authState.user.email : "Not Logged In"}
            />
          </ListItem>
          <Divider />

          {/* Your Bookings Option */}
          {authState.isAuthenticated && (
            <ListItem
              button
              onClick={() => { navigate("/your-bookings"); setDrawerOpen(false); }}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#424242" , color: "white" },
              }}
            >
              <ListItemText primary="Your Bookings" />
            </ListItem>
          )}

          {/* Logout Button (Only when logged in) */}
          {authState.isAuthenticated && (
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#424242" , color: "white" },
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
