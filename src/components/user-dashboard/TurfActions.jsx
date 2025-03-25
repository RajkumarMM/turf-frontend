import React, { useState } from "react";
import { Call, LocationOn} from "@mui/icons-material";

const TurfActions = ({ ownerPhone, turfAddress }) => {
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ownerPhone);
    alert("Phone number copied!");
  };

  const openGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      turfAddress
    )}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="d-flex items-center gap-2 mt-4">
       {/* Call Button */}
       <button className="btn btn-dark" onClick={() => setShowModal(true)}>
        <Call />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Call Now</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Do you want to make a call?</p>
                <p>
                  <strong>Contact Number: {ownerPhone}</strong>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <a href={`tel:${ownerPhone}`} className="btn btn-success">
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showModal && <div className="modal-backdrop show"></div>}
        {/* Get Directions Button */}
        <button
          className="btn btn-dark"
          onClick={openGoogleMaps}
        >
          <LocationOn fontSize="small" />
          <span>Get Directions</span>
        </button>
    </div>
  );
};

export default TurfActions;
