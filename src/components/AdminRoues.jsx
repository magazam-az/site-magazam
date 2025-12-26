import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotFound from "./NotFound";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
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

  // Yoxlama davam edirsə, heç nə göstərmə
  if (isChecking) {
    return null;
  }

  // Yalnız autentifikasiya olunmuş və admin olan istifadəçilər üçün məzmunu göstər
  if (!isAuthenticated || !user || userRole !== "admin") {
    return <NotFound />;
  }

  return children;
};

export default AdminRoute;
