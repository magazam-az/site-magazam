import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSpecQuery, useUpdateSpecMutation } from "../../redux/api/specApi";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "./AdminLayout";

const EditSpec = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetSpecQuery(id);
  const [updateSpec] = useUpdateSpecMutation();

  const [specForm, setSpecForm] = useState({
    name: "",
  });

  useEffect(() => {
    if (data?.spec) {
      const spec = data.spec;
      setSpecForm({
        name: spec.name || "",
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSpecForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!specForm.name.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Xüsusiyyət adı tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      await updateSpec({ id, data: { name: specForm.name.trim() } }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Xüsusiyyət uğurla yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/specs");
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Xüsusiyyət yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Xüsusiyyəti Redaktə Et">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Xüsusiyyəti Redaktə Et">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Xüsusiyyəti Redaktə Et</h1>
                <p className="text-gray-600">Xüsusiyyət məlumatlarını yeniləyin</p>
              </div>
              <button
                onClick={() => navigate("/admin/specs")}
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
                      Xüsusiyyət Adı *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={specForm.name}
                      onChange={handleInputChange}
                      placeholder="Məs. Rəng"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-[#5C4977]/20"
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

export default EditSpec;



