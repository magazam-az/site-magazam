import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllPopularCategoriesQuery, useDeletePopularCategoriesMutation } from "../../redux/api/popularCategoriesApi";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const AdminPopularCategories = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllPopularCategoriesQuery();
  const [deletePopularCategories] = useDeletePopularCategoriesMutation();

  const popularCategoriesList = data?.popularCategories || [];

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu Popular Categories-ni silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deletePopularCategories(id).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Popular Categories uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Popular Categories silinərkən xəta baş verdi",
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

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Popular Categories">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Popular Categories">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Popular Categories İdarəetməsi</h1>
                <p className="text-gray-600">Popular Categories-ləri idarə edin</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/admin/add-popular-categories")}
                  className="bg-[#5C4977] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-[#5C4977]/20 cursor-pointer"
                >
                  <FaPlus className="h-5 w-5" />
                  Yeni Popular Categories
                </button>
              </div>
            </div>
          </div>

          {/* PopularCategories Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#5C4977]">Popular Categories Siyahısı</h2>
              <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                {popularCategoriesList.length || 0} Popular Categories
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5C4977]/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Başlıq</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Yaradılma Tarixi</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {popularCategoriesList.map((popularCategories) => (
                    <tr
                      key={popularCategories._id}
                      className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{popularCategories.title || "Popular Categories"}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          popularCategories.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {popularCategories.isActive ? 'Aktiv' : 'Deaktiv'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600 text-sm">
                          {formatDate(popularCategories.createdAt)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/edit-popular-categories/${popularCategories._id}`)}
                            className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                            title="Redaktə et"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(popularCategories._id)}
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

            {popularCategoriesList.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Heç bir Popular Categories tapılmadı
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPopularCategories;

