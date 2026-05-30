import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaGoogle } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

export default function Profile() {
  const [isSignup, setIsSignup] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const navigate = useNavigate();

  const siteKey =
    import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
    process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  // ✅ Countdown timer for OTP (5 minutes)
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // =========================
  // Validation Schemas
  // =========================
  const loginSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const signupSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const forgotPasswordSchema = Yup.object({
    email: Yup.string().email("Enter a valid email").required("Email is required"),
  });

  const resetPasswordSchema = Yup.object({
    email: Yup.string().required("Email is required"),
    otp: Yup.string().required("OTP is required"),
    newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
  });

  // =========================
  // Submit login/signup
  // =========================
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (!captchaToken) {
      alert("Please verify that you are not a robot!");
      return;
    }

    try {
      const url = isSignup
        ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`
        : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`;

      const response = await axios.post(url, { ...values, captchaToken }, { withCredentials: true });

      alert("✅ " + response.data.message);

      if (response.data.user) {
        localStorage.setItem("token", response.data.token || "");
        localStorage.setItem("userName", response.data.user.name || "");
        localStorage.setItem("userEmail", response.data.user.email || "");
      }

      resetForm();
      setCaptchaToken(null);
      navigate("/shop");
    } catch (error) {
      alert("❌ " + (error.response?.data?.message || "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // Google Login
  // =========================
  const handleGoogleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/google`, "_self");
  };

  // =========================
  // Forgot Password - Send OTP
  // =========================
  const handleSendOtp = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/forgot-password`,
        { email: values.email }
      );
      alert("✅ OTP sent to your email");
      setOtpSent(true);
      setOtpTimer(5 * 60); // 5 minutes countdown
    } catch (error) {
      alert("❌ " + (error.response?.data?.message || "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // Reset Password using OTP
  // =========================
  const handleResetPassword = async (values, { setSubmitting }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/reset-password`,
        values
      );
      alert("✅ Password reset successfully");
      setForgotPassword(false);
      setOtpSent(false);
    } catch (error) {
      alert("❌ " + (error.response?.data?.message || "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {!forgotPassword ? (
          <>
            <h2 className="login-title">{isSignup ? "Create Account" : "Login"}</h2>
            <p className="login-subtitle">
              {isSignup ? "Please fill in your details to register" : "Please login to your account"}
            </p>

            <Formik
              enableReinitialize
              initialValues={isSignup ? { name: "", email: "", password: "" } : { email: "", password: "" }}
              validationSchema={isSignup ? signupSchema : loginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="login-form">
                  {isSignup && (
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <Field type="text" id="name" name="name" />
                      <ErrorMessage name="name" component="div" className="error-message" />
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field type="email" id="email" name="email" />
                    <ErrorMessage name="email" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field type="password" id="password" name="password" />
                    <ErrorMessage name="password" component="div" className="error-message" />
                  </div>

                  <div style={{ margin: "15px 0" }}>
                    {siteKey ? (
                      <ReCAPTCHA sitekey={siteKey} onChange={(token) => setCaptchaToken(token)} />
                    ) : (
                      <p className="error-message">⚠️ reCAPTCHA site key not found. Check your .env setup.</p>
                    )}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? (isSignup ? "Creating Account..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
                  </button>

                  <button type="button" className="google-btn" onClick={handleGoogleLogin}>
                    <FaGoogle className="icon" /> Continue with Google
                  </button>

                  <p className="toggle-link" onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                  </p>

                  <p className="forgot-link" onClick={() => setForgotPassword(true)}>
                    Forgot Password?
                  </p>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <>
            <h2 className="login-title">Reset Password</h2>

            {!otpSent ? (
              <Formik
                initialValues={{ email: "" }}
                validationSchema={forgotPasswordSchema}
                onSubmit={handleSendOtp}
              >
                {({ isSubmitting }) => (
                  <Form className="login-form">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <Field type="email" id="email" name="email" />
                      <ErrorMessage name="email" component="div" className="error-message" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="submit-btn">
                      {isSubmitting ? "Sending OTP..." : "Send OTP"}
                    </button>
                    <p className="toggle-link" onClick={() => setForgotPassword(false)}>
                      Back to Login
                    </p>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{ email: "", otp: "", newPassword: "" }}
                validationSchema={resetPasswordSchema}
                onSubmit={handleResetPassword}
              >
                {({ isSubmitting }) => (
                  <Form className="login-form">
                    <div className="form-group">
                      <label>Email</label>
                      <Field type="email" name="email" />
                      <ErrorMessage name="email" component="div" className="error-message" />
                    </div>
                    <div className="form-group">
                      <label>OTP</label>
                      <Field type="text" name="otp" />
                      <ErrorMessage name="otp" component="div" className="error-message" />
                      {otpTimer > 0 ? <p>Resend OTP in {otpTimer}s</p> : <p>You can resend OTP now</p>}
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <Field type="password" name="newPassword" />
                      <ErrorMessage name="newPassword" component="div" className="error-message" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="submit-btn">
                      {isSubmitting ? "Resetting..." : "Reset Password"}
                    </button>
                    <p className="toggle-link" onClick={() => setForgotPassword(false)}>
                      Back to Login
                    </p>
                  </Form>
                )}
              </Formik>
            )}
          </>
        )}
      </div>
    </div>
  );
}
