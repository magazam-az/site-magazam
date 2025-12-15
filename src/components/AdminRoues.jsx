import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Eğer kullanıcı authenticate değilse login sayfasına yönlendir
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Sadece authenticate olmuş kullanıcılar için içeriği göster
  return isAuthenticated && user ? children : null;
};

export default AdminRoute;
