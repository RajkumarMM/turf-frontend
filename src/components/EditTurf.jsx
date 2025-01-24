import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress"; // Loading spinner

const EditTurf = () => {
    const { id } = useParams(); // Get the turf ID from the URL
    const navigate = useNavigate();

    // Initialize state with default values
    const [turfData, setTurfData] = useState({
        name: "",
        location: "",
        price: "",
        slots: generateInitialSlots(), // Initialize all slots as available (false)
    });
    
    // Function to initialize all slots to false (not booked)
    function generateInitialSlots() {
        const hours = [...Array(24).keys()].map((hour) => ({
            time: `${hour.toString().padStart(2, "0")}:00`,
            isBooked: false,
        }));
        return hours; // Return an array of objects
    }

    const [loading, setLoading] = useState(true); // To handle loading state

    useEffect(() => {
        // Fetch the existing turf details by ID
        const fetchTurf = async () => {
            try {
                const response = await axios.get(`https://turf-backend-o0i0.onrender.com/api/turfs/${id}`);
                const fetchedData = response.data;
                setTurfData({
                    ...fetchedData,
                    slots: fetchedData.slots || generateInitialSlots(), // Default to empty slots if not provided
                });
            } catch (err) {
                console.error("Error fetching turf details:", err);
                alert("Error fetching turf details");
            } finally {
                setLoading(false);
            }
        };

        fetchTurf();
    }, [id]);

    // Handle input changes for turf details
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTurfData({ ...turfData, [name]: value });
    };

    // Toggle slot availability
    const handleSlotChange = (index) => {
        const updatedSlots = [...turfData.slots];
        updatedSlots[index].isBooked = !updatedSlots[index].isBooked;
        setTurfData({ ...turfData, slots: updatedSlots });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth");
            return;
        }

        try {
            await axios.put(`https://turf-backend-o0i0.onrender.com/api/turfs/${id}`, turfData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Turf updated successfully!");
            navigate("/owner-dashboard"); // Redirect to the home page
        } catch (error) {
            console.error("Error updating turf:", error.response?.data || error.message);
            alert("Failed to update turf. Please try again.");
        }
    };

    // Generate 24-hour slots for display
    const hours = [...Array(24).keys()].map((hour) => `${hour.toString().padStart(2, "0")}:00`);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <CircularProgress />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="container mt-4">
            <h3 className="text-center mb-4">Edit Turf</h3>
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
                            key={index}
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
                Save Changes
            </button>
        </form>
    );
};

export default EditTurf;
