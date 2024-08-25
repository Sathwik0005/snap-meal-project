import { useState } from "react";
import { motion } from "framer-motion";
import "./index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      password.length < minLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      return `Password must be strong: 8+ characters, uppercase/lowercase, numbers, and symbols.`;
    }
    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setPasswordError("");
    setConfirmPasswordError("");
    setEmailError("");

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      return;
    }

    axios
      .post("http://localhost:8081/signup", { name, email, password })
      .then((res) => {
        Cookies.set("token", res.data.token, { expires: 30 });
        navigate("/");
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          setEmailError(
            "Email is already in use. Please use a different email."
          );
        } else {
          console.log(err);
        }
      });
  };

  return (
    <div className="login-bg-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="login-form-container"
      >
        <h2>Create an Account</h2>
        <form id="signupForm" onSubmit={handleSubmit}>
          <section className="login-input-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Full Name</label>
          </section>
          <section className="login-input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </section>
          <section className="login-input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
            {passwordError && (
              <span className="login-password-error-message">
                {passwordError}
              </span>
            )}
          </section>
          <section className="login-input-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm Password</label>
            {confirmPasswordError && (
              <span className="login-password-error-message">
                {confirmPasswordError}
              </span>
            )}
            {emailError && (
              <p className="login-password-error-message">{emailError}</p>
            )}
          </section>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>
        <p>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
