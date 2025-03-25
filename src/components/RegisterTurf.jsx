import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Checkbox, FormControlLabel, Grid, Typography, Card, CardMedia, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const RegisterTurf = () => {
  const [turfData, setTurfData] = useState({
    name: "",
    location: "",
    address: "",
    contactNumber: "",
    price: "",
    openingTime: "",
    closingTime: "",
    images: [],
    sports: {
      cricket: false,
      football: false,
      tennis: false,
    },
  });

  const [previews, setPreviews] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurfData({ ...turfData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setTurfData((prevData) => ({
      ...prevData,
      sports: {
        ...prevData.sports,
        [name]: checked,
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (turfData.images.length + files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
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
    if (!token) return;

    const formData = new FormData();
    Object.entries(turfData).forEach(([key, value]) => {
      if (key !== "images" && key !== "sports") {
        formData.append(key, value);
      }
    });

    Object.keys(turfData.sports).forEach((sport) => {
      formData.append(`sports[${sport}]`, turfData.sports[sport]);
    });

    turfData.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.post("https://turf-backend-o0i0.onrender.com/api/registerTurf", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("Turf registered successfully!");
      setTurfData({
        name: "",
        location: "",
        address: "",
        contactNumber: "",
        price: "",
        openingTime: "",
        closingTime: "",
        images: [],
        sports: { cricket: false, football: false, tennis: false },
      });
      setPreviews([]);
    } catch (error) {
      alert("Failed to register turf. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Register Your Turf
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/owner-dashboard")}>
        Back
      </Button>
      <Grid container spacing={2} marginTop={2}>
        {["name", "location", "address", "contactNumber", "price"].map((field) => (
          <Grid item xs={12} key={field}>
            <TextField fullWidth label={field} name={field} value={turfData[field]} onChange={handleChange} required />
          </Grid>
        ))}
        <Grid item xs={12}>
  <TextField fullWidth label="Opening Time" InputLabelProps={{ shrink: true }} name="openingTime" type="time" value={turfData.openingTime} onChange={handleChange} required />
</Grid>
<Grid item xs={12}>
  <TextField fullWidth label="Closing Time" InputLabelProps={{ shrink: true }} name="closingTime" type="time" value={turfData.closingTime} onChange={handleChange} required />
</Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Sports Available:</Typography>
          {Object.keys(turfData.sports).map((sport) => (
            <FormControlLabel
              key={sport}
              control={<Checkbox name={sport} checked={turfData.sports[sport]} onChange={handleCheckboxChange} />}
              label={sport.charAt(0).toUpperCase() + sport.slice(1)}
            />
          ))}
        </Grid>
        <Grid item xs={12}>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        </Grid>
        {previews.length > 0 && (
          <Grid item xs={12} container spacing={2}>
            {previews.map((preview, index) => (
              <Grid item key={index}>
                <Card>
                  <CardMedia component="img" height="100" image={preview} alt={`Preview ${index}`} />
                  <IconButton onClick={() => handleRemoveImage(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
        Register Turf
      </Button>
    </form>
  );
};

export default RegisterTurf;
