import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ProductList.css";

const ProductList = () => {
  const { products, addToCart, loading } = useContext(ProductContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "men's clothing",
    "women's clothing",
    "jewelery",
    "electronics",
  ];

  // Filter products by search text and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="product-loading">Loading products... Please wait</div>;
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1 className="product-list-title">Explore Our Products</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for products by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="product-search-input"
        />

        {/* Category Filter Buttons */}
        <div className="product-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`product-category-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
          No products found matching your search.
        </div>
      ) : (
        <motion.div layout className="product-grid">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                className="product-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="product-image-wrap">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                  />
                </div>
                <h3 className="product-title" title={product.title}>
                  {product.title}
                </h3>
                <p className="product-price">${product.price}</p>
                <div className="product-actions">
                  <Link
                    to={`/products/${product.id}`}
                    className="product-details-link"
                  >
                    Details
                  </Link>
                  <motion.button
                    onClick={() => addToCart(product)}
                    className="product-add-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add To Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ProductList;
