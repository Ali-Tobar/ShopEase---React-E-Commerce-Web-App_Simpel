import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../components/firebase";
import { ProductContext } from "./ProductContext";

export const ProductProvider = ({ children }) => {
  // my state variables
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  // load saved cart from browser so items stay after page refresh
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage", error);
      return [];
    }
  });

  // save cart to localStorage every time the cart updates
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cart]);

  // check if user is logged in or logged out with firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // get products from the api when page first loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // add product to cart (if already in cart, just increase quantity by 1)
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // plus button (+): add 1 to quantity
  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  // minus button (-): remove 1, and delete item if quantity becomes 0
  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // delete item from cart completely
  const removeFromCart = (product) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== product.id)
    );
  };

  // empty the whole cart
  const clearCart = () => {
    setCart([]);
  };

  // logout user
  const logout = () => {
    return signOut(auth);
  };

  // share everything with other components
  return (
    <ProductContext.Provider
      value={{
        products,
        selectedProducts,
        setSelectedProducts,
        cart,
        user,
        loading,
        authLoading,
        addToCart,
        addToCard: addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        logout,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
