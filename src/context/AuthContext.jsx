import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext); // Custom Hook

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
    phoneVerified: false,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem("role");

    if (token && user && role) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        setAuthState({ token, role, isAuthenticated: true, phoneVerified: true, user });
      }
    }
  }, []);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  };

  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role || "user");

    setAuthState({ token, role: user.role, isAuthenticated: true, phoneVerified: true, user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setAuthState({ token: null, role: null, isAuthenticated: false, phoneVerified: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
