import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import the AuthContext

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [role, setRole] = useState("player"); // "player" or "owner"
  const [name, setName] = useState(""); // For registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { authState, setAuthState } = useAuth(); // Access the authState and setAuthState from context

  useEffect(() => {
    // Check for token and navigate to the appropriate dashboard
    if (authState.isAuthenticated) {
      if (authState.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  }, [authState, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const endpoint = isLogin ? "/login" : "/register";
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api${endpoint}`,
        {
          name: !isLogin ? name : undefined, // Include name only for registration
          email,
          password,
          role,
        }
      );
  
      if (isLogin) {
        const { token, role } = response.data;

        // Store token and role in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Update the authState in context
        setAuthState({
          token,
          role,
          isAuthenticated: true,
        });
  
        // Navigate to the appropriate dashboard based on role
        if (role === "owner") {
          navigate("/owner-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert("Registration successful! You can now log in.");
        setIsLogin(true); // Switch to login after successful registration
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="auth-container">
        {/* Form Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>
          {role === "owner" ? "Owner" : "Player"} {isLogin ? "Login" : "Register"}
        </h2>

        {/* Role Selector */}
        <button
            className="btn btn-sm btn-primary"
            onClick={() => setRole(role === "player" ? "owner" : "player")}
          >
            Switch to {role === "player" ? "Owner" : "Player"}
          </button>
          </div>

        <form onSubmit={handleSubmit}>
          {/* Name field for registration */}
          {!isLogin && (
            <div className="mb-3">
              <label>Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email field */}
          <div className="mb-3">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password field */}
          <div className="mb-3">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="btn btn-primary">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <button
          className="btn btn-link mt-3"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register here"
            : "Already have an account? Login here"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
