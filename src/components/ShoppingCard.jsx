import React, { useState, useEffect } from "react";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
} from "../redux/api/productsApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { X, Loader2 } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Breadcrumb from "./ui/Breadcrumb";

const SebetCart = ({ isOpen, onClose }) => {
  const { data: cartData, isLoading, error } = useGetCartQuery();
  const navigate = useNavigate();

  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateQuantity] = useUpdateCartQuantityMutation();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Calculate subtotal
  const calculateTotal = () => {
    if (!cartData?.cart) return 0;
    
    return cartData.cart.reduce((total, item) => {
      if (!item?.product) {
        return total;
      }
      const price = item.product.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const subtotal = calculateTotal();
  const freeShippingThreshold = 3470; // 3.470,00 ₼
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleQuantityChange = async (productId, currentQuantity, stock, change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      toast.error("Məhsul sayı 1-dən az ola bilməz");
      return;
    }

    if (newQuantity > stock) {
      toast.error("Kifayət qədər stok yoxdur");
      return;
    }

    try {
      await updateQuantity({ productId, quantity: newQuantity }).unwrap();
      toast.success("Məhsul sayı yeniləndi");
    } catch (error) {
      toast.error("Miqdar yenilənərkən xəta baş verdi");
    }
  };

  const handleRemoveFromCart = async (productId, e) => {
    e.stopPropagation();
    try {
      await removeFromCart(productId).unwrap();
      toast.success("Məhsul səbətdən silindi");
    } catch (error) {
      toast.error("Məhsul silinərkən xəta baş verdi");
    }
  };

  const handleViewCart = () => {
    onClose();
    navigate("/shopping-cart");
  };

  const handleCheckout = () => {
    if (onClose) onClose();
    navigate("/checkout");
  };

  const handleReturnToShop = () => {
    if (onClose) onClose();
    navigate("/catalog");
  };

  // Filter valid cart items
  const validCartItems = (cartData?.cart && Array.isArray(cartData.cart)) 
    ? cartData.cart.filter(item => item?.product) 
    : [];

  // If used as a full page (isOpen is undefined), render full page layout
  if (isOpen === undefined) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
        <Navbar />
        <section className="flex-1">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-3">
            {/* Breadcrumb */}
            <div className="py-6 pb-0">
              <Breadcrumb 
                items={[
                  { label: "Ana səhifə", path: "/" },
                  { label: "Səbət" }
                ]}
              />
            </div>

            {/* Page Title */}
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                Səbət
              </h2>
              {!isLoading && validCartItems.length > 0 && (
                <p className="text-gray-600 mt-2">
                  Səbətinizdə {validCartItems.length} {validCartItems.length === 1 ? 'məhsul' : 'məhsul'} var
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm p-12">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
                </div>
              </div>
            ) : error || (!isLoading && validCartItems.length === 0) ? (
              /* Empty Cart State */
              <div className="bg-white rounded-xl shadow-sm mb-8">
                <div className="flex flex-col items-center justify-center py-12 px-4 space-y-6">
                  <div>
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
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800">Səbətiniz boşdur</h3>
                  <p className="text-lg md:text-xl text-gray-600 text-center max-w-md">
                    Səbətinizə məhsul əlavə etmək üçün məhsul səhifəsinə keçin
                  </p>
                  <button
                    onClick={handleReturnToShop}
                    className="px-8 py-3 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 font-medium cursor-pointer shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out"
                  >
                    Mağazaya Qayıt
                  </button>
                </div>
              </div>
            ) : (
              /* Cart with Items - Full Page Layout */
              <div className="lg:grid lg:grid-cols-3 lg:gap-6 pb-6">
                {/* Cart Items - Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-4 mb-6 lg:mb-0">
                  {validCartItems.map((item) => (
                    <div
                      key={item.product._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-6 border border-gray-100"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="block w-full h-full cursor-pointer"
                          >
                            <img
                              src={
                                item.product.images && item.product.images.length > 0
                                  ? item.product.images[0]?.url
                                  : "/placeholder.svg"
                              }
                              alt={item.product.name}
                              className="w-full h-full object-contain rounded-lg cursor-pointer transition-transform hover:scale-105"
                            />
                          </Link>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${item.product._id}`}
                                className="block cursor-pointer group"
                              >
                                <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-[#5C4977] transition-colors cursor-pointer">
                                  {item.product.name}
                                </h3>
                              </Link>
                              {item.product.sku && (
                                <p className="text-xs text-gray-500 mt-1">
                                  SKU: {item.product.sku}
                                </p>
                              )}
                              <div className="mt-2">
                                <span className="text-lg font-bold text-[#5C4977]">
                                  {(item.product.price || 0).toFixed(2)} ₼
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleRemoveFromCart(item.product._id, e)}
                              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 cursor-pointer p-2 hover:bg-red-50 rounded-full"
                              title="Səbətdən sil"
                            >
                              <X className="w-5 h-5 cursor-pointer" />
                            </button>
                          </div>

                          {/* Quantity and Total Price */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            {/* Quantity Selector */}
                            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product._id,
                                    item.quantity,
                                    item.product.stock,
                                    -1
                                  )
                                }
                                className="px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-700 font-semibold cursor-pointer"
                              >
                                −
                              </button>
                              <span className="px-6 py-2 text-base font-semibold min-w-[4rem] text-center bg-white border-x-2 border-gray-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product._id,
                                    item.quantity,
                                    item.product.stock,
                                    1
                                  )
                                }
                                className="px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-700 font-semibold cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            {/* Total Price */}
                            <div className="text-right">
                              <span className="text-xs text-gray-500 block">Cəmi:</span>
                              <span className="text-xl font-bold text-gray-900">
                                {(item.quantity * (item.product.price || 0)).toFixed(2)} ₼
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary - Right Column (1/3) */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                      Sifariş Xülasəsi
                    </h3>

                    {/* Free Shipping Progress */}
                    {remainingForFreeShipping > 0 && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                          </svg>
                          <span className="text-sm font-semibold text-purple-900">
                            Pulsuz çatdırılma
                          </span>
                        </div>
                        <p className="text-sm text-purple-700 mb-2">
                          Səbətə <span className="font-bold">{remainingForFreeShipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₼</span> əlavə edin
                        </p>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, ((freeShippingThreshold - remainingForFreeShipping) / freeShippingThreshold) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Məhsullar:</span>
                        <span>{validCartItems.length} ədəd</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Çatdırılma:</span>
                        <span className="text-green-600 font-semibold">
                          {remainingForFreeShipping === 0 ? 'Pulsuz' : 'Hesablanacaq'}
                        </span>
                      </div>
                      <div className="pt-4 border-t-2 border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Yekun:</span>
                          <span className="text-2xl font-bold text-[#5C4977]">
                            {subtotal.toFixed(2)} ₼
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full px-6 py-4 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-all font-semibold cursor-pointer text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Sifariş Ver
                    </button>

                    {/* Continue Shopping */}
                    <button
                      onClick={handleReturnToShop}
                      className="w-full mt-3 px-6 py-3 bg-white text-[#5C4977] border-2 border-[#5C4977] rounded-lg hover:bg-[#5C4977]/5 transition-colors font-medium cursor-pointer"
                    >
                      Alış-verişə davam et
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Modal mode
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Cart Modal */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">Səbət</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-all cursor-pointer"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
            </div>
          ) : error || !validCartItems.length ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="mb-8">
                <svg
                  className="w-40 h-40 text-gray-300 mx-auto"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 6L18 18M18 6L6 18"
                  />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-900 mb-8 text-center">
                Səbətdə məhsul yoxdur.
              </p>
              <button
                onClick={handleReturnToShop}
                className="px-8 py-3 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-colors font-medium cursor-pointer"
              >
                Mağazaya Qayıt
              </button>
            </div>
          ) : (
            /* Cart with Items */
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {validCartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      <Link
                        to={`/product/${item.product._id}`}
                        onClick={() => onClose && onClose()}
                        className="block w-full h-full cursor-pointer"
                      >
                        <img
                          src={
                            item.product.images && item.product.images.length > 0
                              ? item.product.images[0]?.url
                              : "/placeholder.svg"
                          }
                          alt={item.product.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product._id}`}
                            onClick={() => onClose && onClose()}
                            className="block cursor-pointer"
                          >
                            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 cursor-pointer">
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.product.sku && (
                            <p className="text-xs text-gray-500">
                              SKU: {item.product.sku}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleRemoveFromCart(item.product._id, e)}
                          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2 cursor-pointer"
                        >
                          <X className="w-4 h-4 cursor-pointer" />
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity,
                                item.product.stock,
                                -1
                              )
                            }
                            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-gray-600 font-medium cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-4 py-1.5 text-sm font-medium min-w-[3rem] text-center border-x border-gray-300 bg-gray-50">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity,
                                item.product.stock,
                                1
                              )
                            }
                            className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-gray-600 font-medium cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-semibold text-gray-900 text-sm">
                          {item.quantity} × {(item.product.price || 0).toFixed(2)} ₼
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-medium">Yekun:</span>
                  <span className="font-semibold text-gray-900">
                    {subtotal.toFixed(2)} ₼
                  </span>
                </div>

                {/* Free Shipping Message */}
                {remainingForFreeShipping > 0 && (
                  <p className="text-sm text-gray-600 mb-6">
                    Səbətə {remainingForFreeShipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₼ əlavə edin və pulsuz çatdırılma əldə edin!
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleViewCart}
                    className="flex-1 px-6 py-3 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-colors font-medium cursor-pointer"
                  >
                    Səbəti Gör
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="flex-1 px-6 py-3 bg-white text-[#5C4977] border-2 border-[#5C4977] rounded-lg hover:bg-[#5C4977]/5 transition-colors font-medium cursor-pointer"
                  >
                    Sifariş Ver
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SebetCart;
