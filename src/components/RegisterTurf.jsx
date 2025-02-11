import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterTurf = () => {
  const [turfData, setTurfData] = useState({
    name: "",
    location: "",
    price: "",
    images: [],
  });

  const [previews, setPreviews] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurfData({ ...turfData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (turfData.images.length + files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds 5MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setTurfData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...validFiles],
    }));

    const filePreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...turfData.images];
    newImages.splice(index, 1);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);

    setTurfData({ ...turfData, images: newImages });
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const formData = new FormData();
    formData.append("name", turfData.name);
    formData.append("location", turfData.location);
    formData.append("price", turfData.price);

    turfData.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.post("http://localhost:5000/api/registerTurf", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Turf registered successfully!");
      setTurfData({ name: "", location: "", price: "", images: [] });
      setPreviews([]);
    } catch (error) {
      console.error("Error registering turf:", error.response?.data || error.message);
      alert("Failed to register turf. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h3 className="text-center mb-4">Register Your Turf</h3>

      <button type="button" className="btn btn-primary mb-2" onClick={() => navigate("/owner-dashboard")}>
        Back
      </button>

      <div className="mb-3">
        <label className="form-label">Turf Name:</label>
        <input type="text" className="form-control" name="name" value={turfData.name} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Location:</label>
        <input type="text" className="form-control" name="location" value={turfData.location} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Price:</label>
        <input type="number" className="form-control" name="price" value={turfData.price} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Upload Turf Images (Max 5 images, 5MB each):</label>
        <input type="file" className="form-control" accept="image/*" multiple onChange={handleImageChange} />
      </div>

      {previews.length > 0 && (
        <div className="mb-3">
          <label className="form-label">Preview:</label>
          <div className="d-flex flex-wrap">
            {previews.map((preview, index) => (
              <div key={index} className="position-relative">
                <img src={preview} alt={`Preview ${index}`} className="img-thumbnail m-1" style={{ maxHeight: "150px", objectFit: "cover" }} />
                <button type="button" className="btn btn-danger btn-sm position-absolute" style={{ top: "5px", right: "5px" }} onClick={() => handleRemoveImage(index)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary w-100">Register Turf</button>
    </form>
  );
};

export default RegisterTurf;
