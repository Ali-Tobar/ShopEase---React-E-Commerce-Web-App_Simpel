import { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import "../styles/AuthDetails.css";

const AuthDetails = () => {
  const { user, logout } = useContext(ProductContext);

  const handleSignOut = () => {
    logout()
      .then(() => {
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  return (
    <div className="auth-details-container">
      <h3 className="auth-details-header">Authentication Details</h3>
      {user ? (
        <div className="auth-details-card">
          <span className="auth-details-badge">● Signed In</span>
          <div className="auth-details-row">
            <span className="auth-details-label">Name:</span>
            <span className="auth-details-value">{user.displayName || "Not specified"}</span>
          </div>
          <div className="auth-details-row">
            <span className="auth-details-label">Email:</span>
            <span className="auth-details-value">{user.email}</span>
          </div>
          <div className="auth-details-row">
            <span className="auth-details-label">User ID:</span>
            <span className="auth-details-value" style={{ fontSize: "0.8rem", color: "#64748b" }}>
              {user.uid}
            </span>
          </div>
          <button onClick={handleSignOut} className="auth-details-signout-btn">
            Sign Out
          </button>
        </div>
      ) : (
        <div className="auth-details-loggedout">
          <p>Signed Out (No active session)</p>
          <div className="auth-details-actions">
            <Link to="/login" className="auth-details-btn-primary">
              Login
            </Link>
            <Link to="/register" className="auth-details-btn-secondary">
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDetails;
