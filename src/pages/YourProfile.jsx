import React from "react";
import { useNavigate } from "react-router-dom";
import "./YourProfile.css";

const YourProfile = ({ user }) => {
  const navigate = useNavigate();

  // ✅ Agar user login nahi hai
  if (!user) {
    return (
      <div className="yourprofile-container">
        <div className="yourprofile-card">
          <h1 className="yourprofile-title">You are not logged in</h1>
          <p className="yourprofile-message">
            Please create an account or login to view your profile.
          </p>
          <button
            className="yourprofile-login-btn"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ Agar user login hai
  return (
    <div className="yourprofile-container">
      <div className="yourprofile-card">
        <h1 className="yourprofile-title">Your Profile</h1>

        <div className="yourprofile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {user.joined || "January 2025"}</p>
        </div>

        <button className="yourprofile-edit-btn">Edit Profile</button>
      </div>
    </div>
  );
};

export default YourProfile;
