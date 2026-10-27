import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useContext(ProductContext);

  if (authLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 20px", color: "#64748b" }}>
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated user to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
