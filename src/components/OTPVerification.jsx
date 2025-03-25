import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { auth } from "../../config/firebaseConfig.js";
import { requestForToken } from "../../config/firebaseConfig.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
 

const OTPVerification = () => {
  const { login} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const loginType = location.state?.loginType || "user"; 

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA resolved:", response);
        },
        "expired-callback": () => {
          console.error("reCAPTCHA expired. Refreshing...");
        },
      });
    }
  }, []);

  // OTP function
  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const phoneNumber = `+${phone.replace(/\D/g, "")}`; 
      if (phoneNumber.length < 12 || phoneNumber.length > 15) {
        alert("Invalid phone number length.");
        return;
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error("OTP Error:", err);
    }
    setLoading(false);
  };

  // OTP check
  const verifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      setOtpVerified(true);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error("OTP Verification Error:", err);
    }
    setLoading(false);
  };

  // User Data Backend
  const saveUserDetails = async () => {
    setError("");
    setLoading(true);
    try {
        const user = {
            phone,
            role: loginType === "owner" ? "owner" : "player",
            name,
            email,
            fcmToken: null,  // Default null
        };

        // ✅ If the user is an owner, fetch the FCM token
        if (loginType === "owner") {
            const fcmToken = await requestForToken();
            if (fcmToken) {
                user.fcmToken = fcmToken; // Store the FCM token
            }
        }

        const response = await axios.post("https://turf-backend-o0i0.onrender.com/api/save-user", user);
        const token = response.data.token;
        localStorage.setItem("token", token);
        login(user, token);

        if (location.state?.booking) {
            navigate("/payment", { state: { bookingDetails: location.state.bookingDetails } });
        } else {
            user.role === "owner" ? navigate("/owner-dashboard") : navigate("/");
        }
    } catch (err) {
        setError("Failed to register user. Please try again.");
        console.error("User Registration Error:", err);
    }
    setLoading(false);
};
  

  return (
    <Container maxWidth="xs">
      <Box textAlign="center" mt={5} p={3} border={1} borderRadius={2} borderColor="grey.300">
        <Typography variant="h5" fontWeight="bold">
          {loginType === "owner" ? "Owner Login" : "Player Login"}
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {!otpSent ? (
          <>
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
              inputStyle={{
                width: "100%",
                height: "56px",
                fontSize: "16px",
                borderRadius: "5px",
                borderColor: "#ccc",
              }}
            />
            <Button variant="contained" color="primary" fullWidth onClick={sendOtp} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Send OTP"}
            </Button>
          </>
        ) : !otpVerified ? (
          <>
            <TextField label="Enter OTP" variant="outlined" fullWidth margin="normal" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button variant="contained" color="primary" fullWidth onClick={verifyOtp} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Verify OTP"}
            </Button>
          </>
        ) : (
          <>
            <TextField label="Full Name" variant="outlined" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Email" type="email" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button variant="contained" color="primary" fullWidth onClick={saveUserDetails} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </Box>
    </Container>
  );
};

export default OTPVerification;
