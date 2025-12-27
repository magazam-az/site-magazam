import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUnitMutation } from "../../redux/api/unitApi";
import Swal from "sweetalert2";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const CreateUnit = () => {
  const navigate = useNavigate();
  const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();

  const [unitForm, setUnitForm] = useState({
    name: "",
    title: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnitForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!unitForm.name.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Name tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    if (!unitForm.title.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Başlıq tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      await createUnit({
        name: unitForm.name.trim().toLowerCase(),
        title: unitForm.title.trim(),
      }).unwrap();

      Swal.fire({
        title: "Uğur!",
        text: "Ölçü vahidi uğurla əlavə edildi",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/product-attributes");
    } catch (error) {
      console.error("Xəta:", error);
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Ölçü vahidi əlavə edilərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  return (
    <AdminLayout pageTitle="Yeni Ölçü Vahidi">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Yeni Ölçü Vahidi Əlavə Et</h1>
                <p className="text-gray-600">Yeni ölçü vahidi məlumatlarını daxil edin</p>
              </div>
              <button
                onClick={() => navigate("/admin/product-attributes")}
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
                  Əsas Məlumatlar
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Ad *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={unitForm.name}
                      onChange={handleInputChange}
                      placeholder="Məs. sm"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Başlıq *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={unitForm.title}
                      onChange={handleInputChange}
                      placeholder="Məs. Santimetr"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5C4977]/20"
              >
                {isCreating ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin mx-auto" />
                ) : (
                  'Ölçü Vahidini Əlavə Et'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateUnit;

