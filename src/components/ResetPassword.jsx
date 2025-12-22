import React, { useState, useEffect } from 'react';
import { useResetPasswordMutation } from '../redux/api/authApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const [resetPassword, { isLoading, error, isSuccess }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    console.log('ResetPassword component mounted, token:', token);
    
    // Əgər vercel.app-dədirsə, magazam.az-ə yönləndir
    if (window.location.hostname.includes('vercel.app')) {
      const currentPath = window.location.pathname;
      const newUrl = `https://magazam.az${currentPath}`;
      console.log('Redirecting from vercel.app to magazam.az:', newUrl);
      window.location.replace(newUrl);
      return;
    }
    
    if (!token) {
      console.log('No token found, redirecting to forgot-password');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = 'Şifrə tələb olunur';
    } else if (formData.password.length < 8) {
      errors.password = 'Şifrə ən azı 8 simvol olmalıdır';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Şifrəni təsdiqləyin';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Şifrələr uyğun gəlmir';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }).unwrap();
    } catch (err) {
      console.error('Reset password failed:', err);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#5C4977] mb-4">Şifrə Uğurla Dəyişdirildi!</h1>
            <p className="text-gray-600 mb-6">
              Şifrəniz uğurla yeniləndi. İndi yeni şifrənizlə giriş edə bilərsiniz.
            </p>
            <button
              onClick={handleBackToLogin}
              className="w-full bg-[#5C4977] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 cursor-pointer"
            >
              Giriş Et
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Yeni Şifrə Təyin Edin</h1>
          <p className="text-gray-600">Yeni şifrənizi daxil edin</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* API Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error.data?.message || 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.'}</span>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#5C4977] mb-2">
                Yeni Şifrə
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#5C4977]/60" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                    formErrors.password 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                  }`}
                  placeholder="Yeni şifrənizi daxil edin"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#5C4977]/60 hover:text-[#5C4977]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#5C4977]/60 hover:text-[#5C4977]" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5C4977] mb-2">
                Şifrəni Təsdiqlə
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#5C4977]/60" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                    formErrors.confirmPassword 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                  }`}
                  placeholder="Şifrənizi təkrar daxil edin"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-[#5C4977]/60 hover:text-[#5C4977]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#5C4977]/60 hover:text-[#5C4977]" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5C4977] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#5C4977]/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Şifrəni Dəyişdir
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 META SHOP. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

