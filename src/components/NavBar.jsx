import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa6";
import { ProductContext } from "../context/ProductContext";
import "../styles/NavBar.css";

const NavBar = () => {
  const { cart, user, logout } = useContext(ProductContext);
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/" className="navbar-brand">
          ShopApp
        </Link>
        <Link to="/" className="navbar-link">
          Home
        </Link>
      </div>

      <div className="navbar-auth-section">
        {user ? (
          <div className="navbar-user-info">
            <span className="navbar-welcome">
              Hi, <strong>{user.displayName || user.email.split("@")[0]}</strong>
            </span>
            <button onClick={handleLogout} className="navbar-logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-links">
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </div>
        )}

        <Link to="/cart" className="navbar-cart-btn">
          <FaCartPlus size={18} />
          <span>Cart</span>
          <span className="navbar-cart-badge">{totalItems}</span>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
