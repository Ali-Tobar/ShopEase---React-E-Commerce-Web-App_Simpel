import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { username, email, password } = formData;

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Save username to Firebase user profile
        if (username) {
          await updateProfile(userCredential.user, {
            displayName: username,
          });
        }
        console.log("User registered successfully:", userCredential.user);
        alert("Account created successfully!");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration error:", error.message);
        setErrorMsg(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <motion.div
      className="register-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <h2 className="register-title">Create an Account</h2>

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            className="register-error-box"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-field">
          <label className="register-label">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="register-input"
            placeholder="johndoe"
            required
          />
        </div>

        <div className="register-field">
          <label className="register-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="register-field">
          <label className="register-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="register-input"
            placeholder="••••••••"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="register-submit-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Creating Account..." : "Register"}
        </motion.button>
      </form>

      <p className="register-footer">
        Already have an account?{" "}
        <Link to="/login" className="register-footer-link">
          Login here
        </Link>
      </p>
    </motion.div>
  );
};

export default RegisterPage;
