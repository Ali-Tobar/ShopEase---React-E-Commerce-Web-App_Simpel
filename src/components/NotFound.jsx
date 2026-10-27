import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/NotFound.css";

const NotFound = () => {
  return (
    <motion.div
      className="not-found-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="not-found-code">404</div>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-text">
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="not-found-btn">
        ← Back to Homepage
      </Link>
    </motion.div>
  );
};

export default NotFound;
