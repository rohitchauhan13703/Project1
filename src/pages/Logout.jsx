import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Remove user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    // 🔹 Optional: Clear cookies/session if any backend session used
    // await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });

    // 🔹 Redirect user to login page
    navigate("/profile"); // redirect to login (Profile.jsx)
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        color: "#444",
      }}
    >
      Logging you out...
    </div>
  );
}
