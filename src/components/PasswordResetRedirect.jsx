import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Bu komponent köhnə format linkləri (crud/v1/password/reset/token/...) 
// yeni format route-a (/password/reset/token/...) yönləndirir
const PasswordResetRedirect = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // URL-dən token-i çıxar (əgər params-dan gəlmirsə)
    let resetToken = token;
    
    if (!resetToken && location.pathname) {
      // Path-dən token-i çıxar: /crud/v1/password/reset/token/TOKEN
      const pathParts = location.pathname.split('/');
      const tokenIndex = pathParts.indexOf('token');
      if (tokenIndex !== -1 && pathParts[tokenIndex + 1]) {
        resetToken = pathParts[tokenIndex + 1];
      }
    }

    if (resetToken) {
      // Token-i çıxarıb düzgün route-a yönləndir
      console.log('Redirecting to:', `/password/reset/token/${resetToken}`);
      navigate(`/password/reset/token/${resetToken}`, { replace: true });
    } else {
      // Token yoxdursa forgot password səhifəsinə yönləndir
      console.log('No token found, redirecting to forgot-password');
      navigate('/forgot-password', { replace: true });
    }
    
    setIsRedirecting(false);
  }, [token, navigate, location]);

  if (!isRedirecting) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin mx-auto" />
      </div>
    </div>
  );
};

export default PasswordResetRedirect;

