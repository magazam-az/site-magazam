import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetBrandsQuery, useDeleteBrandMutation } from "../../redux/api/brandApi";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const BrandManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetBrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();

  const brands = data?.brands || [];

  const handleDeleteBrand = async (brandId) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu brendi silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deleteBrand(brandId).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Brend uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Brend silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Brendlər">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Brendlər">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Brend İdarəetməsi</h1>
                <p className="text-gray-600">Brendləri idarə edin</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/admin/brands/create")}
                  className="bg-[#5C4977] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-[#5C4977]/20 cursor-pointer"
                >
                  <FaPlus className="h-5 w-5" />
                  Yeni Brend
                </button>
              </div>
            </div>
          </div>

          {/* Brands Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#5C4977]">Brendlər Siyahısı</h2>
              <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                {brands.length || 0} brend
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5C4977]/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Ad</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr
                      key={brand._id}
                      className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{brand.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/brands/edit/${brand._id}`)}
                            className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                            title="Redaktə et"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBrand(brand._id)}
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

            {brands.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Heç bir brend tapılmadı
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BrandManagement;
