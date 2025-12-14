import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllOrdersQuery, useDeleteOrderMutation, useUpdateOrderStatusMutation } from "../../redux/api/orderApi";
import Swal from "sweetalert2";
import { FaTrash, FaEye } from "react-icons/fa";
import AdminLayout from "./AdminLayout";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const orders = data?.orders || [];

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu sifarişi silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deleteOrder(id).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Sifariş uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Sifariş silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      Swal.fire({
        title: "Uğurlu!",
        text: "Sifariş statusu yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
      });
      refetch();
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Status yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Processing":
        return "İşləməkdə";
      case "Shipped":
        return "Göndərilib";
      case "Delivered":
        return "Çatdırılıb";
      case "Cancelled":
        return "Ləğv edilib";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Sifarişlər">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Sifarişlər">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Sifarişlər İdarəetməsi</h1>
                <p className="text-gray-600">Bütün sifarişləri idarə edin</p>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#5C4977]">Sifarişlər Siyahısı</h2>
              <div className="flex items-center gap-4">
                <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                  {orders.length || 0} sifariş
                </span>
                {data?.totalAmount && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    Ümumi: {data.totalAmount.toFixed(2)} ₼
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5C4977]/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Sifariş ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">İstifadəçi</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Məhsul Sayı</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Məbləğ</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Tarix</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800 text-sm">
                          #{order._id.slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-800">
                            {order.user?.name || "İstifadəçi"}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {order.user?.email || ""}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600 text-sm">
                          {order.orderItems?.length || 0} məhsul
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#5C4977]">
                          {order.totalPrice?.toFixed(2) || "0.00"} ₼
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs font-medium px-3 py-1 rounded-full border-0 ${getStatusColor(order.orderStatus)} cursor-pointer`}
                        >
                          <option value="Processing">İşləməkdə</option>
                          <option value="Shipped">Göndərilib</option>
                          <option value="Delivered">Çatdırılıb</option>
                          <option value="Cancelled">Ləğv edilib</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600 text-sm">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("az-AZ", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Tarix yoxdur"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                            title="Bax"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Sil"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {orders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Heç bir sifariş tapılmadı
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#5C4977]/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#5C4977]">
                  Sifariş Detalları #{selectedOrder._id.slice(-8).toUpperCase()}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* İstifadəçi Məlumatları */}
              <div>
                <h3 className="text-lg font-semibold text-[#5C4977] mb-3">İstifadəçi Məlumatları</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Ad:</span> {selectedOrder.user?.name || "N/A"}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.user?.email || "N/A"}</p>
                </div>
              </div>

              {/* Çatdırılma Məlumatları */}
              <div>
                <h3 className="text-lg font-semibold text-[#5C4977] mb-3">Çatdırılma Məlumatları</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Ünvan:</span> {selectedOrder.shippingInfo?.address || "N/A"}</p>
                  <p><span className="font-medium">Şəhər:</span> {selectedOrder.shippingInfo?.city || "N/A"}</p>
                  <p><span className="font-medium">Telefon:</span> {selectedOrder.shippingInfo?.phoneNo || "N/A"}</p>
                  {selectedOrder.shippingInfo?.postalCode && (
                    <p><span className="font-medium">Poçt Kodu:</span> {selectedOrder.shippingInfo.postalCode}</p>
                  )}
                </div>
              </div>

              {/* Məhsullar */}
              <div>
                <h3 className="text-lg font-semibold text-[#5C4977] mb-3">Məhsullar</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Miqdar: {item.quantity} × {item.price?.toFixed(2)} ₼
                        </p>
                      </div>
                      <p className="font-bold text-[#5C4977]">
                        {(item.quantity * item.price)?.toFixed(2)} ₼
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qiymət Xülasəsi */}
              <div>
                <h3 className="text-lg font-semibold text-[#5C4977] mb-3">Qiymət Xülasəsi</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Məhsullar:</span>
                    <span>{selectedOrder.itemsPrice?.toFixed(2) || "0.00"} ₼</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Çatdırılma:</span>
                    <span>{selectedOrder.shippingPrice?.toFixed(2) || "0.00"} ₼</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 font-bold text-lg">
                    <span>Ümumi:</span>
                    <span className="text-[#5C4977]">
                      {selectedOrder.totalPrice?.toFixed(2) || "0.00"} ₼
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-[#5C4977] mb-3">Status</h3>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {getStatusText(selectedOrder.orderStatus)}
                  </span>
                  {selectedOrder.deliveredAt && (
                    <span className="text-sm text-gray-600">
                      Çatdırılma: {new Date(selectedOrder.deliveredAt).toLocaleDateString("az-AZ")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#5C4977]/10 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#5C4977] text-white px-6 py-2 rounded-lg hover:bg-[#5C4977]/90 transition-colors cursor-pointer"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;

