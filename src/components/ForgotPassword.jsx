import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../redux/api/authApi';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [forgotPassword, { isLoading, error, isSuccess }] = useForgotPasswordMutation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
  });

  const [formErrors, setFormErrors] = useState({});

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

    if (!formData.email.trim()) {
      errors.email = 'Email tələb olunur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email düzgün deyil';
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
      const result = await forgotPassword({ email: formData.email }).unwrap();
      // Uğurlu olduqda isSuccess avtomatik true olacaq
    } catch (err) {
      console.error('Forgot password failed:', err);
      // Error artıq komponentdə göstərilir (error state)
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
            <h1 className="text-2xl font-bold text-[#5C4977] mb-4">Email Göndərildi!</h1>
            <p className="text-gray-600 mb-6">
              Şifrə sıfırlama linki <strong>{formData.email}</strong> ünvanına göndərildi.
              Zəhmət olmasa emailinizi yoxlayın və linkə klikləyin.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Email gəlmədisə, spam qovluğunu yoxlayın və ya bir neçə dəqiqə gözləyin.
            </p>
            <button
              onClick={handleBackToLogin}
              className="w-full bg-[#5C4977] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 cursor-pointer"
            >
              Giriş səhifəsinə qayıt
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
          <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Şifrəni Unutdunuz?</h1>
          <p className="text-gray-600">Emailinizi daxil edin, biz sizə şifrə sıfırlama linki göndərərik</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* API Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error.data?.message || 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.'}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#5C4977] mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#5C4977]/60" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                    formErrors.email 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                  }`}
                  placeholder="email@example.com"
                  disabled={isLoading}
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
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
                  <Mail className="h-5 w-5" />
                  Şifrə Sıfırlama Linki Göndər
                </>
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Giriş səhifəsinə qayıt
              </button>
            </div>
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

export default ForgotPassword;

