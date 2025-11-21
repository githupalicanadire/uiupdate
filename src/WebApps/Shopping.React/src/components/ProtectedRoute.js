import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          fontSize: "1.2rem",
          color: "#667eea",
        }}
      >
        🔄 Yükleniyor...
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated()) {
    // Redirect to login with the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is for unauthenticated users (like login/register) and user is authenticated
  if (!requireAuth && isAuthenticated()) {
    // Redirect to home or intended page
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
