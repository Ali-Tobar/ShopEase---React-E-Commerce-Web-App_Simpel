import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
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

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { email, password } = formData;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in user:", userCredential.user);
        alert("Login successful!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error.message);
        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          setErrorMsg("Invalid email or password. Please try again.");
        } else {
          setErrorMsg(error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <h2 className="auth-title">Welcome Back</h2>

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            className="auth-error-box"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleLogin} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            placeholder="••••••••"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="auth-submit-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Signing in..." : "Login"}
        </motion.button>
      </form>

      <p className="auth-footer">
        Don't have an account?{" "}
        <Link to="/register" className="auth-footer-link">
          Register here
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginPage;
