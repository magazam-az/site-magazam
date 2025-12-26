import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userApi";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { Loader2, Search } from "lucide-react";
import Swal from "sweetalert2";
import AdminLayout from "./AdminLayout";

const AdminUsers = () => {
  const { data, error, isLoading, refetch } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (id) => {
    navigate(`/admin/edit-user/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "İstifadəçini silmək istədiyinizdən əminsinizmi?",
      text: "Bu əməliyyat geri qaytarıla bilməz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Xeyr, ləğv et",
      reverseButtons: true,
      confirmButtonColor: "#5C4977",
      cancelButtonColor: "#6B7280",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id).unwrap();
        await refetch();
        Swal.fire({
          title: "Silindi!",
          text: "İstifadəçi uğurla silindi.",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
      } catch (error) {
        console.error("İstifadəçi silinərkən xəta baş verdi:", error);
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "İstifadəçi silinərkən xəta baş verdi.",
          icon: "error",
          confirmButtonColor: "#DC2626",
        });
      }
    }
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    if (!searchQuery.trim()) return data.users;

    const query = searchQuery.toLowerCase().trim();
    return data.users.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const role = user.role?.toLowerCase() || "";
      return name.includes(query) || email.includes(query) || role.includes(query);
    });
  }, [data?.users, searchQuery]);

  if (isLoading) {
    return (
      <AdminLayout pageTitle="İstifadəçilər">
        <div className="bg-gray-50 min-h-full p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout pageTitle="İstifadəçilər">
        <div className="bg-gray-50 min-h-full p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
              <p className="font-medium">Xəta baş verdi:</p>
              <p>{error?.data?.error || error.message || "İstifadəçilər yüklənərkən xəta baş verdi"}</p>
              <button
                onClick={refetch}
                className="mt-3 bg-[#5C4977] text-white px-4 py-2 rounded-lg hover:bg-[#5C4977]/90 transition-colors cursor-pointer"
              >
                Yenidən yoxla
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="İstifadəçilər">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">İstifadəçilərin İdarə Edilməsi</h1>
                <p className="text-gray-600">Bütün istifadəçiləri görüntüləyin və idarə edin</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-[#5C4977]">İstifadəçilər Siyahısı</h2>
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#5C4977]/60" />
                  <input
                    type="text"
                    placeholder="Axtarış..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors w-full md:w-64"
                  />
                </div>
                <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
                  {filteredUsers.length} / {data?.users?.length || 0} istifadəçi
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5C4977]/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Ad</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Rol</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Qeydiyyat Tarixi</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {user.avatar?.url ? (
                            <img
                              src={user.avatar.url}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-[#5C4977] to-[#8B699B] rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div className="font-medium text-gray-800">{user.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">{user.email}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "İstifadəçi"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("az-AZ", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(user._id)}
                            className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                            title="Redaktə et"
                          >
                            <FaRegEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
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

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchQuery.trim() 
                  ? `"${searchQuery}" üçün heç bir istifadəçi tapılmadı`
                  : "Heç bir istifadəçi tapılmadı"}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;





