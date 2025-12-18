import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetPromotionsQuery, useDeletePromotionMutation } from "../../redux/api/promotionApi";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const AdminPromotion = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetPromotionsQuery();
  const [deletePromotion] = useDeletePromotionMutation();

  const promotions = data?.promotions || [];

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu promotion-u silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deletePromotion(id).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Promotion uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Promotion silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ');
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];
    const startDay = start.getDate();
    const startMonth = months[start.getMonth()];
    const endDay = end.getDate();
    const endMonth = months[end.getMonth()];
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Promotion">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Promotion">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Promotion İdarəetməsi</h1>
                <p className="text-gray-600">Promotion-ları idarə edin</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/admin/add-promotion")}
                  className="bg-[#5C4977] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-[#5C4977]/20 cursor-pointer"
                >
                  <FaPlus className="h-5 w-5" />
                  Yeni Promotion
                </button>
              </div>
            </div>
          </div>

          {/* Promotions Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#5C4977]">Promotion Siyahısı</h2>
              <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                {promotions.length || 0} promotion
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5C4977]/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Başlıq</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Tarix Aralığı</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Məhsul Sayı</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Şəkil</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => (
                    <tr
                      key={promotion._id}
                      className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{promotion.title}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600 text-sm">
                          {formatDateRange(promotion.startDate, promotion.endDate)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600 text-sm">
                          {promotion.products?.length || 0} məhsul
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {promotion.image?.url ? (
                          <img
                            src={promotion.image.url}
                            alt={promotion.title}
                            className="w-16 h-16 object-cover rounded-lg border border-[#5C4977]/20"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#5C4977]/10 rounded-lg flex items-center justify-center">
                            <span className="text-[#5C4977]/40 text-xs">Şəkil yoxdur</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/edit-promotion/${promotion._id}`)}
                            className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                            title="Redaktə et"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(promotion._id)}
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

            {promotions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Heç bir promotion tapılmadı
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPromotion;
