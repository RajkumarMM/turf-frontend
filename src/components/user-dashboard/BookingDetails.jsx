import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs"; // Import Day.js

function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Your Turf Bookings</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && bookings.length === 0 && <p>No bookings found.</p>}

      {!loading && bookings.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Turf Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Slot Time</th>
                <th>Price</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{index + 1}</td>
                  <td>{booking.turfDetails.name}</td>
                  <td>{booking.turfDetails.location}</td>
                  <td>{dayjs(booking.createdAt).format("DD MMM YYYY")}</td>
                  <td>{`${booking.startTime} - ${booking.endTime}`}</td>
                  <td>₹{booking.price}</td>
                  <td>
                    {booking.isPaid ? (
                      <span className="badge bg-success">Paid</span>
                    ) : (
                      <span className="badge bg-warning">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingDetails;
