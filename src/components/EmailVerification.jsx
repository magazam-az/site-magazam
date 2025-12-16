import React, { useState, useEffect, useRef } from 'react';
import { useVerifyEmailMutation, useResendVerificationEmailMutation } from '../redux/api/authApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, Loader2, ArrowLeft, KeyRound } from 'lucide-react';

const EmailVerification = () => {
  const [verifyEmail, { isLoading: isVerifying, isSuccess: isVerified, error: verifyError }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending, isSuccess: isResent, error: resendError }] = useResendVerificationEmailMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']); // 6 rəqəmli kod
  const codeInputRefs = useRef(Array(6).fill(null).map(() => React.createRef()));
  const [showCodeForm, setShowCodeForm] = useState(false);

  useEffect(() => {
    // URL-dən email parametrini al
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
      setShowCodeForm(true);
    }
  }, [searchParams]);

  // Kod daxil edərkən avtomatik növbəti input-a keç
  const handleCodeChange = (index, value) => {
    // Yalnız rəqəm qəbul et
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Növbəti input-a fokus et
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.current?.focus();
    }

    // Bütün kodlar doldurulubsa, avtomatik verify et
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  // Backspace ilə geri silmə
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.current?.focus();
    }
  };

  // Paste funksionallığı
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      // Son input-a fokus et
      codeInputRefs.current[5]?.current?.focus();
      // Avtomatik verify et
      setTimeout(() => handleVerify(pastedData), 100);
    }
  };

  const handleVerify = async (verificationCode) => {
    if (!email || !verificationCode || verificationCode.length !== 6) {
      return;
    }

    try {
      await verifyEmail({ email, code: verificationCode }).unwrap();
    } catch (err) {
      console.error('Email verification failed:', err);
      // Kodları təmizlə
      setCode(['', '', '', '', '', '']);
      codeInputRefs.current[0]?.current?.focus();
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      await resendVerification({ email }).unwrap();
      // Kodları təmizlə
      setCode(['', '', '', '', '', '']);
      setShowCodeForm(true);
    } catch (err) {
      console.error('Resend verification failed:', err);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Uğurlu təsdiqləmə
  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#5C4977] mb-4">Email Uğurla Təsdiqləndi!</h1>
            <p className="text-gray-600 mb-6">
              Hesabınız uğurla aktivləşdirildi. İndi giriş edə bilərsiniz.
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

  // Kod daxil etmə formu
  if (showCodeForm && email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Email Təsdiqləmə</h1>
            <p className="text-gray-600">Emailinizə göndərilən 6 rəqəmli kodu daxil edin</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-8">
            {isResent && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
                ✅ Yeni kod <strong>{email}</strong> ünvanına göndərildi!
              </div>
            )}

            {verifyError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {verifyError.data?.message || 'Kod yanlışdır və ya vaxtı bitmişdir. Zəhmət olmasa yeni kod istəyin.'}
              </div>
            )}

            <div className="space-y-6">
              {/* Email göstər */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Kod göndərildi:</p>
                <p className="text-lg font-semibold text-[#5C4977]">{email}</p>
              </div>

              {/* 6 rəqəmli kod input-ları */}
              <div>
                <label className="block text-sm font-medium text-[#5C4977] mb-3 text-center">
                  Təsdiqləmə Kodu
                </label>
                <div className="flex justify-center gap-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={codeInputRefs.current[index]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-[#5C4977]/30 rounded-xl focus:border-[#5C4977] focus:ring-2 focus:ring-[#5C4977]/20 transition-all"
                      disabled={isVerifying}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Kod 10 dəqiqə ərzində etibarlıdır
                </p>
              </div>

              {/* Verify button */}
              <button
                onClick={() => handleVerify(code.join(''))}
                disabled={isVerifying || code.some(d => !d) || code.join('').length !== 6}
                className="w-full bg-[#5C4977] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#5C4977]/20 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Təsdiqlənir...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-5 w-5" />
                    Təsdiqlə
                  </>
                )}
              </button>

              {/* Resend kod */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Kod gəlmədi?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Göndərilir...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Yeni Kod Göndər
                    </>
                  )}
                </button>
              </div>

              {/* Back to login */}
              <div className="text-center pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Giriş səhifəsinə qayıt
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              © 2024 META SHOP. Bütün hüquqlar qorunur.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Email daxil etmə formu (resend üçün)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Email Təsdiqləmə</h1>
          <p className="text-gray-600">Təsdiqləmə emailini yenidən göndərin</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-8">
          {isResent ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#5C4977] mb-4">Email Göndərildi!</h2>
              <p className="text-gray-600 mb-6">
                Təsdiqləmə kodu <strong>{email}</strong> ünvanına göndərildi.
                Zəhmət olmasa emailinizi yoxlayın və 6 rəqəmli kodu daxil edin.
              </p>
              <button
                onClick={() => {
                  setShowCodeForm(true);
                  setCode(['', '', '', '', '', '']);
                }}
                className="w-full bg-[#5C4977] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 cursor-pointer mb-3"
              >
                Kodu Daxil Et
              </button>
              <button
                onClick={handleBackToLogin}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200 cursor-pointer"
              >
                Giriş Səhifəsinə Qayıt
              </button>
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-6">
              {resendError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {resendError.data?.message || 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.'}
                </div>
              )}

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    placeholder="email@example.com"
                    required
                    disabled={isResending}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isResending || !email}
                className="w-full bg-[#5C4977] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#5C4977]/20 flex items-center justify-center gap-2"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Göndərilir...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    Təsdiqləmə Kodunu Göndər
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Giriş səhifəsinə qayıt
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 META SHOP. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
