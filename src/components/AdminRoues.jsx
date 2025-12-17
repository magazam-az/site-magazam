import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Əgər istifadəçi autentifikasiya olunmayıbsa login səhifəsinə yönləndir
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // İstifadəçinin rolunu yoxla (nested və ya direct)
    const userRole = user?.user?.role || user?.role;

    // Əgər istifadəçi admin deyilsə, blokla və xəta mesajı göstər
    if (userRole !== "admin") {
      toast.error("Sizin adminlik üçün səlahiyyətiniz yoxdur");
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // İstifadəçinin rolunu yoxla
  const userRole = user?.user?.role || user?.role;

  // Yalnız autentifikasiya olunmuş və admin olan istifadəçilər üçün məzmunu göstər
  if (!isAuthenticated || !user || userRole !== "admin") {
    return null;
  }

  return children;
};

export default AdminRoute;
