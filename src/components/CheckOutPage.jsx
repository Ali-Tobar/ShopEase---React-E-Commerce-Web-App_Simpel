import { useState, useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/CheckOutPage.css";

const CheckOutPage = () => {
  const { cart, clearCart, user } = useContext(ProductContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user ? (user.displayName || "") : "",
    email: user ? (user.email || "") : "",
    address: "",
    city: "",
    phone: "",
    paymentMethod: "cash",
  });

  const [isOrdered, setIsOrdered] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const shipping = total > 0 ? 10 : 0;
  const grandTotal = total + shipping;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    clearCart();
    setIsOrdered(true);
  };

  if (isOrdered) {
    return (
      <motion.div
        className="checkout-container checkout-success-box"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="checkout-success-icon">✓</div>
        <h2 className="checkout-success-title">Thank You For Your Order!</h2>
        <p className="checkout-success-msg">
          Your order has been placed successfully. We will contact you at <strong>{formData.phone || formData.email}</strong> shortly.
        </p>
        <button
          onClick={() => navigate("/")}
          className="cart-continue-link"
          style={{ border: "none", cursor: "pointer" }}
        >
          Return to Home
        </button>
      </motion.div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-container checkout-empty-box" style={{ textAlign: "center", padding: "50px 20px" }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: "#64748b", margin: "15px 0 25px" }}>
          You cannot checkout without adding products to your cart.
        </p>
        <Link to="/" className="cart-continue-link">
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="checkout-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        {/* Shipping Form */}
        <div>
          <h2 className="checkout-section-title">Shipping & Contact Info</h2>
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="checkout-form">
            <div className="checkout-field">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="checkout-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="checkout-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+20 123 456 7890"
                required
              />
            </div>

            <div className="checkout-field-row">
              <div className="checkout-field">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street 123, Building 4"
                  required
                />
              </div>

              <div className="checkout-field">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Cairo / Alexandria"
                  required
                />
              </div>
            </div>

            <div className="checkout-field">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="cash">Cash on Delivery</option>
                <option value="card">Credit / Debit Card</option>
              </select>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="checkout-order-summary">
          <h2 className="checkout-section-title">Order Summary</h2>
          <div className="checkout-items-list">
            {cart.map((item) => (
              <div key={item.id} className="checkout-item">
                <span className="checkout-item-title">
                  {item.title} × {item.quantity || 1}
                </span>
                <span className="checkout-item-price">
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="checkout-total-row">
              <span>Shipping Fee:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="checkout-total-row checkout-final-total">
              <span>Grand Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <motion.button
            type="submit"
            form="checkout-form"
            className="checkout-submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Place Order (${grandTotal.toFixed(2)})
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckOutPage;
