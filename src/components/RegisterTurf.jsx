import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterTurf = () => {
  const [turfData, setTurfData] = useState({
    name: "",
    location: "",
    price: "",
    slots: generateInitialSlots(), // Initialize slots as an array of objects
  });
  const navigate = useNavigate();

  // Function to initialize slots as an array of objects
  function generateInitialSlots() {
    const hours = [...Array(24).keys()].map((hour) => ({
      time: `${hour.toString().padStart(2, "0")}:00`,
      isBooked: false,
    }));
    return hours;
  }

  // Handle input changes for turf details
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurfData({ ...turfData, [name]: value });
  };

  // Toggle slot availability
  const handleSlotChange = (index) => {
    const updatedSlots = [...turfData.slots];
    updatedSlots[index].isBooked = !updatedSlots[index].isBooked; // Toggle the `isBooked` status
    setTurfData({ ...turfData, slots: updatedSlots });
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      await axios.post(
        "https://turf-backend-o0i0.onrender.com/api/registerTurf",
        turfData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Turf registered successfully!");
      setTurfData({
        name: "",
        location: "",
        price: "",
        slots: generateInitialSlots(), // Reset all slots
      });
    } catch (error) {
      console.error("Error registering turf:", error.response?.data || error.message);
      alert("Failed to register turf. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h3 className="text-center mb-4">Register Your Turf</h3>
      <button
        type="button"
        className="btn btn-primary mb-2"
        onClick={() => navigate("/owner-dashboard")}
      >
        Back
      </button>

      {/* Turf Details */}
      <div className="mb-3">
        <label className="form-label">Turf Name:</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={turfData.name}
          onChange={handleChange}
          placeholder="Enter turf name"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Location:</label>
        <input
          type="text"
          className="form-control"
          name="location"
          value={turfData.location}
          onChange={handleChange}
          placeholder="Enter location"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Price:</label>
        <input
          type="number"
          className="form-control"
          name="price"
          value={turfData.price}
          onChange={handleChange}
          placeholder="Enter price"
          required
        />
      </div>

      {/* Time Slots */}
      <div className="mb-3">
        <label className="form-label">Time Slots (Daily Availability):</label>
        <div className="d-flex flex-wrap">
          {turfData.slots.map((slot, index) => (
            <div
              key={slot.time}
              className={`slot ${slot.isBooked ? "booked" : "available"}`}
              onClick={() => handleSlotChange(index)}
              style={{
                border: "1px solid #ccc",
                padding: "5px",
                margin: "5px",
                cursor: "pointer",
                backgroundColor: slot.isBooked ? "#ffcccc" : "#ccffcc",
              }}
            >
              {slot.time}
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Register Turf
      </button>
    </form>
  );
};

export default RegisterTurf;
