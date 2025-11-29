import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  // Store strukturuna uyğun olaraq userSlice-dan məlumatları alırıq
  const { isAuthenticated, user } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

export default PrivateRoute;