import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// ⚠️ ADMIN ROUTE PROTECTION TEMPORARILY DISABLED - FOR DEVELOPMENT/TESTING ONLY
const AdminRoute = ({ children }) => {
  // DEVELOPMENT MODE: Admin route protection disabled - allow all access
  // TODO: Re-enable admin protection in production
  console.log('[DEBUG] ⚠️ [AdminRoute] PROTECTION DISABLED - Allowing admin access');
  return children;

  /* ORIGINAL ADMIN ROUTE PROTECTION CODE - COMMENTED OUT
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return isAuthenticated && user?.role === "admin" ? children : null;
  */
};

export default AdminRoute;
