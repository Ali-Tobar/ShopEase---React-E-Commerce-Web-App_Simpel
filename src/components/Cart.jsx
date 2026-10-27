import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Cart.css";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } =
    useContext(ProductContext);
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        {cart.length > 0 && (
          <button onClick={clearCart} className="cart-clear-btn">
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty-box">
          <p className="cart-empty">Your cart is currently empty.</p>
          <Link to="/" className="cart-continue-link">
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div>
          <div className="cart-items-list">
            {cart.map((product) => (
              <motion.div
                key={product.id}
                className="cart-item"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <div className="cart-item-details">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-text">
                    <h4 className="cart-item-name">{product.title}</h4>
                    <p className="cart-item-unit-price">
                      ${product.price} each
                    </p>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-quantity-controls">
                    <button
                      onClick={() => decreaseQuantity(product.id)}
                      className="cart-qty-btn"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="cart-qty-value">
                      {product.quantity || 1}
                    </span>
                    <button
                      onClick={() => increaseQuantity(product.id)}
                      className="cart-qty-btn"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <span className="cart-item-subtotal">
                    ${(product.price * (product.quantity || 1)).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(product)}
                    className="cart-remove-btn"
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="cart-summary">
            <div>
              <span className="cart-total-label">Total Amount:</span>
              <span className="cart-total-value">${total.toFixed(2)}</span>
            </div>

            <motion.button
              onClick={() => navigate("/checkout")}
              className="cart-checkout-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
