import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Typography, Box } from "@mui/material";

const TurfGallery = ({ turf }) => {
  return (
    <div>
      {/* Swiper Image Gallery */}
      <Typography variant="h5" my={2} textAlign="center" textTransform="capitalize">
        Images of {turf.name}
      </Typography>
      {turf.images?.length > 0 ? (
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          style={{ width: "80%", margin: "auto" }}
        >
          {turf.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={`http://localhost:5000/${image}`}
                alt={`Turf ${index + 1}`}
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  display: "block",
                  margin: "auto",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Typography textAlign="center">No images available</Typography>
      )}

      {/* Static Image Thumbnails */}
      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} mt={2}>
        {turf.images?.map((image, index) => (
          <img
            key={index}
            src={`http://localhost:5000/${image}`}
            alt={`Turf ${index + 1}`}
            style={{
              width: "150px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          />
        ))}
      </Box>
    </div>
  );
};

export default TurfGallery;
