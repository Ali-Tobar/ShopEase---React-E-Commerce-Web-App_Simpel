import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductProvider } from "./context/ProductProvider";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import NavBar from "./components/NavBar";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import CheckOutPage from "./components/CheckOutPage";
import AuthDetails from "./components/AuthDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <div className="app-container">
          <NavBar />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            {/* Protect checkout route - only authenticated users can access */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckOutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CheckOutPage"
              element={
                <ProtectedRoute>
                  <CheckOutPage />
                </ProtectedRoute>
              }
            />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/RegisterPage" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/auth-details" element={<AuthDetails />} />
            <Route path="/AuthDetails" element={<AuthDetails />} />

            {/* 404 page for unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;
