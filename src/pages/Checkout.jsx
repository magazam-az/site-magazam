import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCartQuery } from "../redux/api/productsApi";
import { useCreateOrderMutation } from "../redux/api/orderApi";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Loader2 } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading: cartLoading, refetch: refetchCart } = useGetCartQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
  });

  const validCartItems = cartData?.cart?.filter((item) => item?.product) || [];

  // Calculate totals
  const calculateTotal = () => {
    return validCartItems.reduce((total, item) => {
      const price = item.product.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  const subtotal = calculateTotal();
  // Çatdırılma qiyməti - pulsuz
  const shippingPrice = 0; // Çatdırılma pulsuzdur
  const totalPrice = subtotal + shippingPrice;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!shippingInfo.address.trim()) {
      toast.error("Ünvan daxil edin");
      return;
    }
    if (!shippingInfo.city.trim()) {
      toast.error("Şəhər daxil edin");
      return;
    }

    if (validCartItems.length === 0) {
      toast.error("Səbətiniz boşdur");
      navigate("/shopping-cart");
      return;
    }

    try {
      const orderData = {
        shippingInfo,
        paymentInfo: {
          id: "",
          status: "pending",
        },
      };

      console.log("Sifariş göndərilir:", orderData);
      const result = await createOrder(orderData).unwrap();
      console.log("Sifariş cavabı:", result);
      
      // Response kontrolü - başarılı ise devam et
      if (result?.success || result?.order) {
        // Sepeti UI'da güncelle
        try {
          await refetchCart();
        } catch (refetchError) {
          console.error("Səbət yenilənərkən xəta:", refetchError);
        }
        
        toast.success("Sifarişiniz uğurla verildi!");
        
        // Kısa bir gecikme sonra ana sayfaya yönlendir
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        console.error("Gözlənilməz cavab formatı:", result);
        toast.error("Sifariş verilərkən xəta baş verdi");
      }
    } catch (error) {
      // Hata mesajını al
      const errorMessage = 
        error?.data?.message || 
        error?.message || 
        "Sifariş verilərkən xəta baş verdi";
      
      console.error("Sifariş xətası detalları:", {
        error,
        errorData: error?.data,
        errorMessage,
        status: error?.status,
      });
      
      toast.error(errorMessage);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-14 md:pb-0">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (validCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-14 md:pb-0">
        <Navbar />
        <section className="flex-1">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
            {/* Breadcrumb */}
            <div className="mt-6">
              <Breadcrumb
                items={[
                  { label: "Ana səhifə", path: "/" },
                  { label: "Səbət", path: "/shopping-cart" },
                  { label: "Sifariş" },
                ]}
              />
            </div>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-6 max-w-md mx-auto">
                {/* Shopping Cart Icon */}
                <div className="mx-auto">
                  <svg
                    className="w-32 h-32 text-gray-300 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Səbətiniz boşdur
                </h2>
                <p className="text-lg md:text-xl text-gray-600">
                  Sifariş vermək üçün səbətinizə məhsul əlavə edin.
                </p>
                <button
                  onClick={() => navigate("/catalog")}
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#5C4977] text-white text-base font-semibold rounded-lg hover:bg-[#4a3d62] transition-all duration-300 cursor-pointer"
                >
                  Məhsullara bax
                </button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-14 md:pb-0">
      <Navbar />
      <section className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Ana səhifə", path: "/" },
                { label: "Səbət", path: "/shopping-cart" },
                { label: "Sifariş" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#5C4977] mb-6">
                  Çatdırılma Məlumatları
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                      Ünvan *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="Ünvanınızı daxil edin"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors cursor-text"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                      Şəhər *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      placeholder="Şəhər"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors cursor-text"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                      Poçt Kodu (İstəyə bağlı)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                      placeholder="Poçt kodu"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors cursor-text"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-[#5C4977] text-white py-4 px-6 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5C4977]/20 cursor-pointer"
                  >
                    {isCreating ? (
                      <Loader2 className="h-5 w-5 text-white animate-spin mx-auto" />
                    ) : (
                      "Sifarişi Təsdiqlə"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6">
                  Sifariş Xülasəsi
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {validCartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {item.product.images?.[0]?.url && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm cursor-pointer">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {item.product.price?.toFixed(2)} ₼
                        </p>
                      </div>
                      <p className="font-bold text-[#5C4977]">
                        {(item.quantity * item.product.price)?.toFixed(2)} ₼
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Məhsullar:</span>
                    <span>{subtotal.toFixed(2)} ₼</span>
                  </div>
                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Yekun:</span>
                      <span className="text-2xl font-bold text-[#5C4977]">
                        {totalPrice.toFixed(2)} ₼
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Checkout;

