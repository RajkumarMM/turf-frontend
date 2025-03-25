import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import TurfCard from "./TurfCard";
import SearchResults from "./user-dashboard/SearchResults";

const UserDashboard = () => {
  const [turfs, setTurfs] = useState([]);
  const [allTurfs, setAllTurfs] = useState([]); // Store original data
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [userCity, setUserCity] = useState(localStorage.getItem("userCity") || "");
  const { logout } = useAuth();
  const [filters, setFilters] = useState({ price: "", sport: "", distance: "" });

  useEffect(() => {
    fetchAvailableCities();
    if (userCity) {
      fetchTurfsByCity(userCity);
    } else {
      fetchAllTurfs();
    }
  }, [userCity]);


  useEffect(() => {
    applyFilters();
  }, [filters, allTurfs]); // Apply filters whenever they change

  const fetchAvailableCities = async () => {
    try {
      const res = await axios.get("https://turf-backend-o0i0.onrender.com/api/turf-cities");
      setAvailableCities(res.data.cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchAllTurfs = async () => {
    try {
      const response = await axios.get("https://turf-backend-o0i0.onrender.com/api/dashboard");
      setAllTurfs(response.data.turfs);
      setTurfs(response.data.turfs);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTurfsByCity = async (city) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://turf-backend-o0i0.onrender.com/api/turfs?city=${city}`);
      setAllTurfs(response.data.turfs);
      setTurfs(response.data.turfs);
    } catch (error) {
      console.error("Error fetching turfs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const { data } = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const city = data.address.city || data.address.town || "";
          if (city) {
            setUserCity(city);
            localStorage.setItem("userCity", city);
            fetchTurfsByCity(city);
          }
        } catch (error) {
          console.error("Location detection failed:", error);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Location access error:", error);
        setLocationLoading(false);
      }
    );
  };

  const handleCityChange = (city) => {
    setUserCity(city);
    localStorage.setItem("userCity", city);
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      logout();
      alert("Session expired. Please log in again.");
    } else {
      alert("Failed to load data.");
    }
  };

  // **Handle Search Filtering**
  const handleSearch = (query) => {
    if (!query) {
      fetchTurfsByCity(userCity); // If search is empty, refetch turfs for city
      return;
    }

    setTurfs((prevTurfs) =>
      prevTurfs.filter((turf) =>
        turf.name.toLowerCase().startsWith(query.toLowerCase())
      )
    );
  };

  const applyFilters = () => {
    let filteredTurfs = allTurfs.filter((turf) =>
      (filters.price ? turf.price <= parseInt(filters.price) : true) &&
      (filters.sport ? turf.sport === filters.sport : true)// &&
      // (filters.distance ? turf.distance <= parseInt(filters.distance) : true)
    );
    setTurfs(filteredTurfs);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between gap-2 align-items-center my-2">
        {/* Left Side - Dropdown */}
        <div className="w-30">
          {!userCity ? (
            <button
              className="btn btn-success text-white"
              onClick={handleUseLocation}
              disabled={locationLoading}
            >
              {locationLoading ? "Detecting Location..." : "Use Your Location"}
            </button>
          ) : (
            <select
              className="form-select bg-black text-white border-secondary text-capitalize"
              value={userCity}
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value={userCity}>{userCity}</option>
              {availableCities.map((city, index) => (
                <option key={index} value={city} className="text-light text-capitalize">
                  {city}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Right Side - Search Bar */}
        <div className="w-60">
          <SearchResults onSearch={handleSearch} />
        </div>
      </div>
{/* Filters */}
<div className="filters d-flex gap-3 my-3">
        <select name="price" className="form-select" onChange={handleFilterChange}>
          <option value="">Select Price Range</option>
          <option value="500">Up to 500</option>
          <option value="1000">Up to 1000</option>
        </select>
        {/* <select name="sport" className="form-select" onChange={handleFilterChange}>
          <option value="">Select Sport</option>
          <option value="football">Football</option>
          <option value="cricket">Cricket</option>
        </select> */}
        {/* <select name="distance" className="form-select" onChange={handleFilterChange}>
          <option value="">Select Distance</option>
          <option value="5">Within 5km</option>
          <option value="10">Within 10km</option>
        </select> */}
      </div>
      <div className="row my-2 g-4">
        {turfs.length ? (
          turfs.map((turf, index) => (
            <div key={index} className="col-md-4 col-sm-6 col-12">
              <TurfCard turf={turf} />
            </div>
          ))
        ) : (
          <p>No turfs available.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
