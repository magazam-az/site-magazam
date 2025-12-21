import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../redux/api/orderApi';
import { Package, Loader2, ChevronLeft, Calendar, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/ui/Breadcrumb';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetOrderDetailsQuery(id);
  const order = data?.order;

  // Order status rəngləri
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
      case 'işləyir':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
      case 'göndərilib':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
      case 'çatdırılıb':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'ləğv edilib':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Order status mətni
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'İşləyir';
      case 'shipped':
        return 'Göndərilib';
      case 'delivered':
        return 'Çatdırılıb';
      case 'cancelled':
        return 'Ləğv edilib';
      default:
        return status || 'Gözləyir';
    }
  };

  // Tarix formatla
  const formatDate = (dateString) => {
    if (!dateString) return 'Tarix yoxdur';
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-14 md:pb-0">
        <Navbar />
        <section className="flex-1 py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sifariş tapılmadı</h2>
              <p className="text-gray-600 mb-6">Bu sifariş mövcud deyil və ya silinib</p>
              <button
                onClick={() => navigate('/my-orders')}
                className="inline-flex items-center px-6 py-3 bg-[#5C4977] text-white font-semibold rounded-lg hover:bg-[#5C4977]/90 transition-colors cursor-pointer"
              >
                Sifarişlərimə qayıt
              </button>
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
      <section className="flex-1 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: 'Ana səhifə', path: '/' },
                { label: 'Profil', path: '/profile' },
                { label: 'Sifarişlərim', path: '/my-orders' },
                { label: `Sifariş #${order._id.slice(-8).toUpperCase()}` }
              ]}
            />
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate('/my-orders')}
            className="mb-6 flex items-center gap-2 text-[#5C4977] hover:text-[#5C4977]/80 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Sifarişlərimə qayıt</span>
          </button>

          {/* Order Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-6 h-6 text-[#5C4977]" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    Sifariş #{order._id.slice(-8).toUpperCase()}
                  </h1>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}
              >
                {getStatusText(order.orderStatus)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sifariş Məhsulları</h2>
                <div className="space-y-4">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/80x80/6B7280/ffffff?text=Product';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Miqdar: {item.quantity} × {item.price?.toFixed(2)} ₼
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#5C4977] text-lg">
                          {(item.quantity * item.price)?.toFixed(2)} ₼
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              {order.shippingInfo && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#5C4977]" />
                    Çatdırılma Məlumatları
                  </h2>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Şəhər:</span> {order.shippingInfo.city}</p>
                    <p><span className="font-medium">Ünvan:</span> {order.shippingInfo.address}</p>
                    {order.shippingInfo.postalCode && (
                      <p><span className="font-medium">Poçt kodu:</span> {order.shippingInfo.postalCode}</p>
                    )}
                    {order.shippingInfo.phoneNo && (
                      <p><span className="font-medium">Telefon:</span> {order.shippingInfo.phoneNo}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Sifariş Xülasəsi</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Məhsullar:</span>
                    <span>{order.itemsPrice?.toFixed(2) || '0.00'} ₼</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Çatdırılma:</span>
                    <span>
                      {order.shippingPrice === 0 ? (
                        <span className="text-green-600 font-semibold">Pulsuz</span>
                      ) : (
                        `${order.shippingPrice?.toFixed(2) || '0.00'} ₼`
                      )}
                    </span>
                  </div>
                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Yekun:</span>
                      <span className="text-2xl font-bold text-[#5C4977]">
                        {order.totalPrice?.toFixed(2) || '0.00'} ₼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                {order.paymentInfo && (
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#5C4977]" />
                      Ödəniş Məlumatları
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Status:</span>{' '}
                        <span className={order.paymentInfo.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                          {order.paymentInfo.status === 'paid' ? 'Ödənilib' : 'Gözləyir'}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Delivered Date */}
                {order.deliveredAt && (
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Çatdırılma tarixi: {formatDate(order.deliveredAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default OrderDetail;

