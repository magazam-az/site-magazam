import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCartQuery } from "../redux/api/productsApi";
import { useCreateOrderMutation } from "../redux/api/orderApi";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumb from "../components/ui/Breadcrumb";

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    phoneNo: "",
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
  const freeShippingThreshold = 3470;
  const shippingPrice = subtotal >= freeShippingThreshold ? 0 : 10;
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
    if (!shippingInfo.phoneNo.trim()) {
      toast.error("Telefon nömrəsi daxil edin");
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

      await createOrder(orderData).unwrap();
      toast.success("Sifarişiniz uğurla verildi!");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.data?.error || error?.data?.message || "Sifariş verilərkən xəta baş verdi"
      );
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (validCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Səbətiniz boşdur</p>
            <button
              onClick={() => navigate("/catalog")}
              className="bg-[#5C4977] text-white px-6 py-2 rounded-lg hover:bg-[#5C4977]/90 transition-colors cursor-pointer"
            >
              Məhsullara bax
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ünvan *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="Ünvanınızı daxil edin"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şəhər *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        placeholder="Şəhər"
                        className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon Nömrəsi *
                      </label>
                      <input
                        type="tel"
                        name="phoneNo"
                        value={shippingInfo.phoneNo}
                        onChange={handleInputChange}
                        placeholder="+994 XX XXX XX XX"
                        className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poçt Kodu (İstəyə bağlı)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                      placeholder="Poçt kodu"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-[#5C4977] text-white py-4 px-6 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5C4977]/20"
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sifariş verilir...
                      </div>
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
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">
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
                  <div className="flex justify-between text-gray-600">
                    <span>Çatdırılma:</span>
                    <span className={shippingPrice === 0 ? "text-green-600 font-semibold" : ""}>
                      {shippingPrice === 0 ? "Pulsuz" : `${shippingPrice.toFixed(2)} ₼`}
                    </span>
                  </div>
                  {subtotal < freeShippingThreshold && (
                    <p className="text-xs text-gray-500">
                      {(freeShippingThreshold - subtotal).toFixed(2)} ₼ daha əlavə edin və pulsuz çatdırılma əldə edin
                    </p>
                  )}
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

