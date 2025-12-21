import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../redux/api/orderApi';
import { Package, Loader2, ChevronRight, Calendar, MapPin, CreditCard } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/ui/Breadcrumb';

const MyOrders = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetMyOrdersQuery();
  const orders = data?.orders || [];

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
                { label: 'Sifarişlərim' }
              ]}
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sifarişlərim</h1>
            <p className="text-gray-600 mt-2">Bütün sifarişlərinizin tarixçəsi</p>
          </div>

          {/* Orders List */}
          {error ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-red-600">Sifarişlər yüklənərkən xəta baş verdi</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sifariş yoxdur</h2>
              <p className="text-gray-600 mb-6">Hələ heç bir sifariş verməmisiniz</p>
              <button
                onClick={() => navigate('/catalog')}
                className="inline-flex items-center px-6 py-3 bg-[#5C4977] text-white font-semibold rounded-lg hover:bg-[#5C4977]/90 transition-colors cursor-pointer"
              >
                Məhsullara bax
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="w-5 h-5 text-[#5C4977]" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Sifariş #{order._id.slice(-8).toUpperCase()}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          {order.shippingInfo?.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{order.shippingInfo.city}, {order.shippingInfo.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}
                        >
                          {getStatusText(order.orderStatus)}
                        </span>
                        <span className="text-xl font-bold text-[#5C4977]">
                          {order.totalPrice?.toFixed(2) || '0.00'} ₼
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      {order.orderItems?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/64x64/6B7280/ffffff?text=Product';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              Miqdar: {item.quantity} × {item.price?.toFixed(2)} ₼
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#5C4977]">
                              {(item.quantity * item.price)?.toFixed(2)} ₼
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>Məhsullar:</span>
                        <span>{order.itemsPrice?.toFixed(2) || '0.00'} ₼</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>Çatdırılma:</span>
                        <span>
                          {order.shippingPrice === 0 ? (
                            <span className="text-green-600 font-semibold">Pulsuz</span>
                          ) : (
                            `${order.shippingPrice?.toFixed(2) || '0.00'} ₼`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Yekun:</span>
                        <span className="text-xl font-bold text-[#5C4977]">
                          {order.totalPrice?.toFixed(2) || '0.00'} ₼
                        </span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 text-[#5C4977] border border-[#5C4977] rounded-lg hover:bg-[#5C4977] hover:text-white transition-colors cursor-pointer"
                    >
                      Detallara bax
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyOrders;

