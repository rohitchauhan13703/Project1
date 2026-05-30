import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState({ name: "", email: "" });
  const [preferences, setPreferences] = useState({ language: "English", theme: "Dark" });
  const navigate = useNavigate();

  // 🔹 Fetch user info + preferences from backend
  useEffect(() => {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const savedImage = localStorage.getItem("profileImage");

    if (savedImage) setProfileImage(savedImage);

    if (name && email) {
      setUser({ name, email });
    } else {
      // Fetch user info from backend
      fetch(`http://localhost:5000/api/auth/user?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.name && data?.email) {
            setUser({ name: data.name, email: data.email });
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userEmail", data.email);

            // Set profile image
            if (data.profileImage) setProfileImage(data.profileImage);

            // Set preferences
            if (data.preferences) setPreferences(data.preferences);
          }
        })
        .catch((err) => console.error("❌ Error:", err));
    }
  }, []);

  // 🔹 Upload profile image
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("email", user.email);

    try {
      const res = await fetch("http://localhost:5000/api/auth/upload-profile", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setProfileImage(data.imageUrl);
        localStorage.setItem("profileImage", data.imageUrl);
        alert("✅ Profile image uploaded successfully!");
      } else {
        alert(`❌ ${data.message || "Upload failed"}`);
      }
    } catch (err) {
      alert("❌ Error uploading image!");
      console.error(err);
    }
  };

  // 🔹 Remove profile image
  const handleImageRemove = async () => {
    if (!window.confirm("🗑️ Remove this profile image?")) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/remove-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfileImage(null);
        localStorage.removeItem("profileImage");
        alert("✅ Profile image removed!");
      } else {
        alert(`❌ ${data.message || "Failed to remove image"}`);
      }
    } catch (err) {
      console.error("❌ Error removing image:", err);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.clear();
    fetch("http://localhost:5000/api/auth/logout", {
      method: "GET",
      credentials: "include",
    }).finally(() => {
      alert("👋 Logged out successfully!");
      navigate("/");
    });
  };

  // 🔹 Yup schema for password change
  const passwordSchema = Yup.object({
    oldPassword: Yup.string().min(6).required("Old password is required"),
    newPassword: Yup.string().min(6).required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm your password"),
  });

  return (
    <div className="settings-page">
      <div className="settings-card">
        {/* Tabs */}
        <div className="tab-header">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={activeTab === "preferences" ? "active" : ""}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
        </div>

        {/* ================= Profile Section ================= */}
        {activeTab === "profile" && (
          <div className="tab-body fade-in">
            <h2>Your Profile</h2>

            <div className="profile-container">
              <div className="profile-circle">
                {profileImage ? (
                  <>
                    <img src={profileImage} alt="Profile" />
                    <button type="button" className="remove-btn" onClick={handleImageRemove}>
                      ✕
                    </button>
                    <label htmlFor="profile-upload" className="change-label">
                      Change
                    </label>
                  </>
                ) : (
                  <label htmlFor="profile-upload" className="add-placeholder">
                    <span>+</span>
                    Add
                  </label>
                )}

                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="info-section">
                <h3>{user.name || "Guest User"}</h3>
                <p>{user.email || "Not Available"}</p>
              </div>
            </div>

            {/* Password Change */}
            <div className="password-section">
              <h3>Change Password</h3>
              <Formik
                initialValues={{
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={passwordSchema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    const res = await fetch(
                      "http://localhost:5000/api/auth/request-password-change",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email: user.email,
                          oldPassword: values.oldPassword,
                          newPassword: values.newPassword,
                        }),
                      }
                    );

                    const data = await res.json();
                    if (res.ok) {
                      alert("✅ Password updated successfully!");
                      resetForm();
                    } else {
                      alert(`❌ ${data.message || "Failed to update password"}`);
                    }
                  } catch (err) {
                    console.error(err);
                    alert("❌ Server error, please try again later");
                  }
                }}
              >
                <Form className="form-container">
                  <div className="form-group">
                    <label>Old Password</label>
                    <Field type="password" name="oldPassword" />
                    <ErrorMessage name="oldPassword" component="p" className="error" />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <Field type="password" name="newPassword" />
                    <ErrorMessage name="newPassword" component="p" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <Field type="password" name="confirmPassword" />
                    <ErrorMessage name="confirmPassword" component="p" className="error" />
                  </div>

                  <button type="submit" className="save-btn">
                    Update Password
                  </button>
                </Form>
              </Formik>
            </div>

            {/* Logout Button */}
            <div className="logout-section">
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        )}

        {/* ================= Preferences Section ================= */}
        {activeTab === "preferences" && (
          <Formik
            enableReinitialize
            initialValues={preferences}
            onSubmit={async (values) => {
              try {
                const res = await fetch("http://localhost:5000/api/auth/save-preferences", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: user.email, preferences: values }),
                });

                const data = await res.json();
                if (res.ok) {
                  setPreferences(values);
                  alert("✅ Preferences saved successfully!");
                } else {
                  alert(`❌ ${data.message || "Failed to save preferences"}`);
                }
              } catch (err) {
                console.error(err);
                alert("❌ Server error, please try again later");
              }
            }}
          >
            <Form className="tab-body fade-in">
              <h2>Preferences</h2>

              <div className="form-group">
                <label>Language</label>
                <Field as="select" name="language">
                  <option value="English">English</option>
                  <option value="हिन्दी">हिन्दी (Hindi)</option>
                  <option value="ਪੰਜਾਬੀ">ਪੰਜਾਬੀ (Punjabi)</option>
                </Field>
              </div>

              <div className="form-group">
                <label>Theme</label>
                <Field as="select" name="theme">
                  <option value="Light">Light</option>
                  <option value="Dark">Dark</option>
                </Field>
              </div>

              <button type="submit" className="save-btn">
                Save Preferences
              </button>
            </Form>
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Settings;
