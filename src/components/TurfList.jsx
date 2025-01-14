import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TurfList = ({ turfs }) => {
    const navigate = useNavigate();

    const onEdit = (id) => {
        navigate(`/edit-turf/${id}`); // Redirect to edit page
    };

    const onDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this turf?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`https://turf-backend-o0i0.onrender.com/api/turfs/${id}`);
            alert('Turf deleted successfully');
            window.location.reload(); // Refresh the page or update state
        } catch (error) {
            console.error('Error deleting turf:', error.message);
            alert('Error deleting turf');
        }
    };
    

    return (
        <div className="mt-5">
            <h2>Your Turfs</h2>
            {turfs.length === 0 ? (
                <p>No turfs registered yet.</p>
            ) : (
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>#</th>
                            <th>Turf Name</th>
                            <th>Location</th>
                            <th>Price (₹)</th>
                            <th>Timings</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turfs.map((turf, index) => (
                            <tr key={turf._id}>
                                <td>{index + 1}</td>
                                <td>{turf.name}</td>
                                <td>{turf.location}</td>
                                <td>{turf.price}</td>
                                <td>
                                    {turf.timings && turf.timings.length > 0 ? (
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
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => onEdit(turf._id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => onDelete(turf._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TurfList;
