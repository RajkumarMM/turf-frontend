import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const AvailableSlots = ({ turfId, turfPrice, openingTime, closingTime }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const [startSlot, setStartSlot] = useState(null);
  const [endSlot, setEndSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [availableEndSlots, setAvailableEndSlots] = useState([]);
  const [price, setPrice] = useState(0);

  // Function to generate half-hour slots
  const generateSlots = () => {
    let startTime = dayjs(`${date} ${openingTime}`, "YYYY-MM-DD HH:mm");
    let endTime = dayjs(`${date} ${closingTime}`, "YYYY-MM-DD HH:mm");
    const generatedSlots = [];

    while (startTime.isBefore(endTime)) {
      generatedSlots.push(startTime.format("HH:mm"));
      startTime = startTime.add(30, "minute");
    }
    return generatedSlots;
  };

  // Fetch booked slots
  const fetchBookedSlots = async (selectedDate) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `https://turf-backend-o0i0.onrender.com/api/booked-slots?turfId=${turfId}&date=${selectedDate}`
      );
      setBookedSlots(response.data);
    } catch (err) {
      setError("Failed to fetch booked slots. Please try again.");
      setBookedSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSlots(generateSlots());
    fetchBookedSlots(date);
  }, [date]);

  // Handle start slot selection
  const handleStartSlotSelection = (slot) => {
    setStartSlot(slot);
    setShowModal(true);

    const startTime = dayjs(`${date} ${slot}`, "YYYY-MM-DD HH:mm");

    if (!startTime.isValid()) {
      console.error("Error: Invalid start time parsing!");
      return;
    }

    // Filter end slots (at least 1 hour later)
    const endTimeSlots = slots.filter((s) => {
      const slotTime = dayjs(`${date} ${s}`, "YYYY-MM-DD HH:mm");
      return (
        slotTime.isAfter(startTime) && slotTime.diff(startTime, "minute") >= 60
      );
    });

    setAvailableEndSlots(endTimeSlots);
  };

  // Calculate price dynamically
  useEffect(() => {
    if (startSlot && endSlot) {
      const startTime = dayjs(`${date} ${startSlot}`, "YYYY-MM-DD HH:mm");
      const endTime = dayjs(`${date} ${endSlot}`, "YYYY-MM-DD HH:mm");

      if (startTime.isValid() && endTime.isValid()) {
        const durationMinutes = endTime.diff(startTime, "minute");
        const durationHours = durationMinutes / 60;
        setPrice(durationHours * Number(turfPrice));
      } else {
        alert("Please select the start time and end time");
      }
    }
  }, [startSlot, endSlot]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Check Available Slots</h2>

      {/* Date Picker */}
      <label className="form-label">Select Date:</label>
      <input
        type="date"
        className="form-control mb-3"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          fetchBookedSlots(e.target.value);
        }}
      />

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Display Available Slots */}
      {loading ? (
        <p>Loading available slots...</p>
      ) : slots.length > 0 ? (
        <div className="d-flex flex-wrap gap-2">
          {slots.map((slot, index) => {
            const isPast = dayjs(`${date} ${slot}`, "YYYY-MM-DD HH:mm").isBefore(
              dayjs(),
              "minute"
            );
            const isBooked = bookedSlots.includes(slot);

            return (
              <button
                key={index}
                className={`btn btn-sm ${
                  isPast
                    ? "btn-secondary"
                    : isBooked
                    ? "btn-danger"
                    : startSlot === slot
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                onClick={() =>
                  !isPast && !isBooked && handleStartSlotSelection(slot)
                }
                disabled={isPast || isBooked}
              >
                {slot}
              </button>
            );
          })}
        </div>
      ) : (
        <p>No available slots found.</p>
      )}

      {/* Modal for End Slot Selection */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select End Time</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Start Time: <strong>{startSlot}</strong>
                </p>
                <p>
                  End Time: <strong>{endSlot || "Select End Time"}</strong>
                </p>
                <p>
                  Total Price: <strong>₹{price.toFixed(2)}</strong>
                </p>
                <div className="d-flex flex-wrap gap-2">
                  {availableEndSlots.length > 0 ? (
                    availableEndSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm ${
                          endSlot === slot
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setEndSlot(slot)}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p>No valid end slots available.</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    const bookingDetails = {
                      turfId,
                      date,
                      startTime: startSlot,
                      endTime: endSlot,
                      price,
                    };

                    if (!token) {
                      navigate("/otp-verification", {
                        state: {
                          loginType: "player",
                          booking: true,
                          bookingDetails,
                        },
                      });
                      return;
                    }

                    try {
                      const payload = JSON.parse(atob(token.split(".")[1]));

                      if (payload.role === "player") {
                        navigate("/payment", { state: { bookingDetails } });
                      } else {
                        alert(
                          "You are logged in as an Owner. Please log in as a Player to book a turf."
                        );
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        localStorage.removeItem("role");

                        navigate("/otp-verification", {
                          state: {
                            loginType: "player",
                            booking: true,
                            bookingDetails,
                          },
                        });
                      }
                    } catch (error) {
                      console.error("Invalid token:", error);
                      alert("Authentication error. Please log in again.");
                      localStorage.removeItem("token");
                      navigate("/otp-verification");
                    }
                  }}
                  disabled={!endSlot}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && <div className="modal-backdrop show"></div>}
    </div>
  );
}
export default AvailableSlots;
