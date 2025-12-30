import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotFound from "./NotFound";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Token yoxla - localStorage-də token yoxdursa, login-ə yönləndir
    const token = localStorage.getItem('token');
    if (!token) {
      // Token yoxdursa, localStorage-i təmizlə və login-ə yönləndir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      navigate("/login");
      return;
    }

    // Əgər istifadəçi autentifikasiya olunmayıbsa login səhifəsinə yönləndir
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // İstifadəçinin rolunu yoxla (nested və ya direct)
    const userRole = user?.user?.role || user?.role;

    // Əgər istifadəçi admin deyilsə, 404 göstər (redirect etmə)
    if (userRole !== "admin") {
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, user, navigate]);

  // İstifadəçinin rolunu yoxla
  const userRole = user?.user?.role || user?.role;
  
  // Token yoxla
  const token = localStorage.getItem('token');

  // Yoxlama davam edirsə, heç nə göstərmə
  if (isChecking) {
    return null;
  }

  // Token yoxdursa və ya yalnız autentifikasiya olunmuş və admin olan istifadəçilər üçün məzmunu göstər
  if (!token || !isAuthenticated || !user || userRole !== "admin") {
    return <NotFound />;
  }

  return children;
};

export default AdminRoute;
