import React, { useState } from 'react';

const RegisterTurf = ({ onSubmit }) => {
    const [turfData, setTurfData] = useState({
        name: '',
        location: '',
        price: '',
        timings: [''], // Initialize with one empty timing field
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(turfData);
        setTurfData({ name: '', location: '', price: '', timings: [''] });
    };

    return (
        <form onSubmit={handleSubmit} className="container mt-4">
            <h3 className="text-center mb-4">Register Your Turf</h3>
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
