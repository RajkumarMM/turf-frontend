import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditTurf = () => {
    const { id } = useParams(); // Get the turf ID from the URL
    const navigate = useNavigate();

    // Initialize state with default values
    const [turf, setTurf] = useState({
        name: "",
        location: "",
        price: "",
        timings: [],
    });

    const [loading, setLoading] = useState(true); // To handle loading state

    useEffect(() => {
        // Fetch the existing turf details by ID
        const fetchTurf = async () => {
            try {
                const response = await axios.get(`https://turf-backend-o0i0.onrender.com/api/turfs/${id}`);
                setTurf(response.data); // Populate the state with fetched data
            } catch (err) {
                console.error('Error details:', {
                    message: error.message,
                    code: error.code,
                    config: error.config,
                    response: error.response,
                });
                alert("Error fetching turf details");
            } finally {
                setLoading(false);
            }
        };

        fetchTurf();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTurf((prevTurf) => ({
            ...prevTurf,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://turf-backend-o0i0.onrender.com/api/turfs/${id}`, turf); // Update the turf details
            alert("Turf updated successfully");
            navigate("/owner-dashboard"); // Redirect to the home page
        } catch (err) {
            console.error(err);
            alert("Error updating turf");
        }
    };

    if (loading) return <p>Loading...</p>; // Display loading message

    return (
        <div className="container mt-5">
            <h2>Edit Turf</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Turf Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={turf.name || ""} // Fallback to an empty string
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={turf.location || ""} // Fallback to an empty string
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price (₹)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={turf.price || ""} // Fallback to an empty string
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="timings">Timings (comma-separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="timings"
                        name="timings"
                        value={turf.timings.join(", ") || ""} // Convert array to string
                        onChange={(e) =>
                            setTurf((prevTurf) => ({
                                ...prevTurf,
                                timings: e.target.value.split(",").map((t) => t.trim()),
                            }))
                        }
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditTurf;
