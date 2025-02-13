import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const EditTurf = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [turfData, setTurfData] = useState({
        name: "",
        location: "",
        price: "",
        images: [],
    });

    const [loading, setLoading] = useState(true);
    const [newImages, setNewImages] = useState([]); // To store newly added image files
    const [previewImages, setPreviewImages] = useState([]); // To store preview URLs

    useEffect(() => {
        const fetchTurf = async () => {
            try {
                const response = await axios.get(`https://turf-backend-o0i0.onrender.com/api/turfs/${id}`);
                setTurfData({
                    name: response.data.name,
                    location: response.data.location,
                    price: response.data.price,
                    images: response.data.images || [],
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTurfData({ ...turfData, [name]: value });
    };

    const handleImageRemove = (index) => {
        setTurfData({
            ...turfData,
            images: turfData.images.filter((_, i) => i !== index),
        });
    };

    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    
        // Check total image count (existing + new)
        if (turfData.images.length + newImages.length + files.length > 5) {
            alert("You can only upload a maximum of 5 images.");
            return;
        }
    
        // Filter files that exceed the size limit
        const validFiles = files.filter(file => file.size <= maxSize);
        const invalidFiles = files.filter(file => file.size > maxSize);
    
        if (invalidFiles.length > 0) {
            alert("Some files exceed the 5MB limit and were not added.");
        }
    
        setNewImages([...newImages, ...validFiles]);
    
        // Generate preview URLs for valid files
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...newPreviews]);
    };
    

    const handleRemovePreviewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
        setPreviewImages(previewImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", turfData.name);
        formData.append("location", turfData.location);
        formData.append("price", turfData.price);
        turfData.images.forEach((image) => formData.append("existingImages[]", image));
        newImages.forEach((image) => formData.append("newImages", image));

        try {
            await axios.put(`https://turf-backend-o0i0.onrender.com/api/turfs/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Turf updated successfully!");
            navigate("/owner-dashboard");
        } catch (error) {
            console.error("Error updating turf:", error);
            alert("Error updating turf");
        }
    };

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <CircularProgress />
            </div>
        );

    return (
        <form className="container mt-4" onSubmit={handleSubmit}>
            <h3 className="text-center mb-4">Edit Turf</h3>
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
                    required
                />
            </div>

            {/* Existing Images */}
            <div className="mb-3">
                <label className="form-label">Existing Images:</label>
                <div className="d-flex flex-wrap">
                    {turfData.images.map((image, index) => (
                        <div key={index} className="m-2 position-relative">
                            <img
                                src={`https://turf-backend-o0i0.onrender.com/${image.replace(/\\/g, "/")}`}
                                alt={`Existing ${index}`}
                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            />
                            <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute"
                                style={{ top: 0, right: 0 }}
                                onClick={() => handleImageRemove(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* New Image Upload */}
            <div className="mb-3">
                <label className="form-label">Add New Images:</label>
                <input type="file" multiple className="form-control" onChange={handleNewImageChange} />
            </div>

            {/* Preview of New Images */}
            {previewImages.length > 0 && (
                <div className="mb-3">
                    <label className="form-label">New Image Previews:</label>
                    <div className="d-flex flex-wrap">
                        {previewImages.map((preview, index) => (
                            <div key={index} className="m-2 position-relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute"
                                    style={{ top: 0, right: 0 }}
                                    onClick={() => handleRemovePreviewImage(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button type="submit" className="btn btn-success">Save Changes</button>
        </form>
    );
};

export default EditTurf;
