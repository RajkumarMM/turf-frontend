import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterTurf = () => {
    const [turfData, setTurfData] = useState({
        name: '',
        location: '',
        price: '',
        timings: [''], // Initialize with one empty timing field
    });
     const navigate = useNavigate(); // React Router's navigation hook

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTurfData({ ...turfData, [name]: value });
    };

    const handleTimingChange = (index, value) => {
        const newTimings = [...turfData.timings];
        newTimings[index] = value;
        setTurfData({ ...turfData, timings: newTimings });
    };

    const addTimingField = () => {
        setTurfData({ ...turfData, timings: [...turfData.timings, ''] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth"); // Redirect to login if token is not found
          return;
        }
    
        try {
            await axios.post('https://turf-backend-o0i0.onrender.com/api/registerTurf', turfData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Turf registered successfully!');
            setTurfData({ name: '', location: '', price: '', timings: [''] });
        } catch (error) {
            console.error('Error registering turf:', error.response?.data || error.message);
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
            <div className="mb-3">
                <label className="form-label">Timings:</label>
                {turfData.timings.map((timing, index) => (
                    <div className="input-group mb-2" key={index}>
                        <input
                            type="time"
                            className="form-control"
                            value={timing}
                            onChange={(e) => handleTimingChange(index, e.target.value)}
                            placeholder={`Enter timing ${index + 1}`}
                            required
                        />
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={addTimingField}
                >
                    Add Timing
                </button>
            </div>
            <button type="submit" className="btn btn-primary w-100">
                Register Turf
            </button>
        </form>
    );
};

export default RegisterTurf;
