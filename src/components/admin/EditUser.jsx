import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../redux/api/userApi";
import Swal from "sweetalert2";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetUserByIdQuery(id);
  const [updateUser] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (data?.user) {
      const user = data.user;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Ad tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    if (!formData.email.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Email tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    // Şifre validasiyası
    if (formData.password) {
      if (formData.password.length < 8) {
        Swal.fire({
          title: "Xəta!",
          text: "Şifrənin minimum uzunluğu 8 simvol olmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        Swal.fire({
          title: "Xəta!",
          text: "Şifrələr eyni deyil",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
    }

    try {
      // Şifre boşsa göndərmə
      const userData = { ...formData };
      if (!userData.password) {
        delete userData.password;
        delete userData.confirmPassword;
      } else {
        // Şifre varsa, confirmPassword'u göndərmə
        delete userData.confirmPassword;
      }

      await updateUser({ id, userData }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "İstifadəçi məlumatları uğurla yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/users");
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "İstifadəçi yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="İstifadəçini Redaktə Et">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="İstifadəçini Redaktə Et">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">İstifadəçini Redaktə Et</h1>
                <p className="text-gray-600">İstifadəçi məlumatlarını yeniləyin</p>
              </div>
              <button
                onClick={() => navigate("/admin/users")}
                className="flex items-center gap-2 text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors border border-[#5C4977] hover:bg-[#5C4977]/5 px-4 py-2 rounded-xl cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Geri qayıt
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Əsas məlumatlar */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  İstifadəçi Məlumatları
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Ad *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="İstifadəçi adı"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="istifadeci@example.com"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Rol *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  >
                    <option value="user">İstifadəçi</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Şifre bölməsi */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  Şifrə (Yalnız dəyişdirmək istəyirsinizsə doldurun)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Yeni Şifrə
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Minimum 8 simvol"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Boş buraxsanız, şifrə dəyişməyəcək
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Şifrəni Təsdiqlə
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Şifrəni təkrar daxil edin"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-[#5C4977]/20 cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2">
                  Yadda Saxla
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditUser;



