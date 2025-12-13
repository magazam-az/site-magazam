import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetBlogsQuery, useDeleteBlogMutation } from "../../redux/api/blogApi";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import AdminLayout from "./AdminLayout";

const AdminBlog = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();

  const blogs = data?.blogs || [];

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu blog yazısını silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(id).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Blog yazısı uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Blog yazısı silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Bloq">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Bloq">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Bloq İdarəetməsi</h1>
                <p className="text-gray-600">Blog yazılarını idarə edin</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/admin/add-blog")}
                  className="bg-[#5C4977] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-[#5C4977]/20 cursor-pointer"
                >
                  <FaPlus className="h-5 w-5" />
                  Yeni Bloq
                </button>
              </div>
            </div>
          </div>

          {/* Blogs Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#5C4977]">Bloq Yazıları Siyahısı</h2>
              <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                {blogs.length || 0} bloq
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5C4977]/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Başlıq</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Qısa Məzmun</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Tarix</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Şəkil</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{blog.title}</div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600 text-sm line-clamp-2 max-w-xs">
                          {blog.shortContent || blog.content?.substring(0, 100) || "Məzmun yoxdur"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600 text-sm">
                          {blog.date ? new Date(blog.date).toLocaleDateString('az-AZ') : "Tarix yoxdur"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {blog.images?.[0]?.url ? (
                          <img
                            src={blog.images[0].url}
                            alt={blog.title}
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
                            onClick={() => navigate(`/admin/edit-blog/${blog._id}`)}
                            className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                            title="Redaktə et"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
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

            {blogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Heç bir bloq yazısı tapılmadı
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
