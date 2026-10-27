import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart } = useContext(ProductContext);
  const product = products.find((item) => item.id === parseInt(id));

  const handelAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (!product) {
    return <div className="details-loading">Loading product details...</div>;
  }

  return (
    <div className="details-container">
      <Link to="/" className="details-back-link">
        ← Back to Products
      </Link>
      <div className="details-content">
        <div className="details-image-box">
          <img
            src={product.image}
            alt={product.title}
            className="details-image"
          />
        </div>
        <div className="details-info">
          <h1 className="details-title">{product.title}</h1>
          <p className="details-price">${product.price}</p>
          <h4 className="details-desc-title">Description</h4>
          <p className="details-description">{product.description}</p>

          <button onClick={handelAddToCart} className="details-add-btn">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
