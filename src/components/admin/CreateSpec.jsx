import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSpecMutation } from "../../redux/api/specApi";
import { useGetUnitsQuery } from "../../redux/api/unitApi";
import Swal from "sweetalert2";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const CreateSpec = () => {
  const navigate = useNavigate();
  const [createSpec, { isLoading: isCreating }] = useCreateSpecMutation();
  const { data: unitsData, isLoading: unitsLoading } = useGetUnitsQuery();

  const [specForm, setSpecForm] = useState({
    name: "",
    title: "",
    type: "",
    unit: "",
    isFilterable: false,
    status: true,
    selectValues: [], // Select tipi üçün dəyərlər
  });

  // Select values üçün repeater field state
  const [selectValueFields, setSelectValueFields] = useState([]);
  const [selectValueTempIdCounter, setSelectValueTempIdCounter] = useState(0);

  const units = unitsData?.units || [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSpecForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      // Əgər tip select-dən başqa bir şeyə dəyişirsə, selectValues-i təmizlə
      if (name === "type" && value !== "select") {
        setSelectValueFields([]);
      }
      return updated;
    });
  };

  // Select value field əlavə et
  const handleAddSelectValue = () => {
    const newField = {
      tempId: selectValueTempIdCounter,
      name: "",
      title: "",
    };
    setSelectValueFields((prev) => [...prev, newField]);
    setSelectValueTempIdCounter((prev) => prev + 1);
  };

  // Select value field sil
  const handleRemoveSelectValue = (tempId) => {
    setSelectValueFields((prev) => prev.filter((field) => field.tempId !== tempId));
  };

  // Select value field dəyişikliyi
  const handleSelectValueChange = (tempId, field, value) => {
    setSelectValueFields((prev) =>
      prev.map((item) => (item.tempId === tempId ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!specForm.name.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Ad tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    if (!specForm.title.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Başlıq tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    if (!specForm.type) {
      Swal.fire({
        title: "Xəta!",
        text: "Xüsusiyyət tipi seçilməlidir",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    // Number tipi üçün unit required-dır
    if (specForm.type === "number" && (!specForm.unit || specForm.unit === "")) {
      Swal.fire({
        title: "Xəta!",
        text: "Number tipi üçün ölçü vahidi seçilməlidir",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    // Select tipi üçün selectValues validasiyası
    if (specForm.type === "select") {
      const validSelectValues = selectValueFields.filter(
        (field) => field.name && field.name.trim() !== "" && field.title && field.title.trim() !== ""
      );
      if (validSelectValues.length === 0) {
        Swal.fire({
          title: "Xəta!",
          text: "Select tipi üçün ən azı bir dəyər əlavə edilməlidir",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
    }

    try {
      const specData = {
        name: specForm.name.trim(),
        title: specForm.title.trim(),
        type: specForm.type,
        isFilterable: specForm.isFilterable,
        status: specForm.status,
      };

      // Unit - number üçün required, digərləri üçün optional
      if (specForm.unit && specForm.unit !== "") {
        specData.unit = specForm.unit;
      }

      // SelectValues - yalnız select tipi üçün
      if (specForm.type === "select") {
        specData.selectValues = selectValueFields
          .filter((field) => field.name && field.name.trim() !== "" && field.title && field.title.trim() !== "")
          .map((field) => ({
            name: field.name.trim(),
            title: field.title.trim(),
          }));
      }

      console.log("📤 Göndərilən məlumat:", specData);

      await createSpec(specData).unwrap();

      Swal.fire({
        title: "Uğur!",
        text: "Xüsusiyyət uğurla əlavə edildi",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/specs");
    } catch (error) {
      console.error("Xəta:", error);
      console.error("Error data:", error?.data);
      
      let errorMessage = "Xüsusiyyət əlavə edilərkən xəta baş verdi";
      
      if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.validationErrors) {
        const validationErrors = Object.values(error.data.validationErrors).join(", ");
        errorMessage = `Validation xətası: ${validationErrors}`;
      }
      
      Swal.fire({
        title: "Xəta!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  return (
    <AdminLayout pageTitle="Yeni Xüsusiyyət">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Yeni Xüsusiyyət Əlavə Et</h1>
                <p className="text-gray-600">Yeni xüsusiyyət məlumatlarını daxil edin</p>
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
                      Ad *
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

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Başlıq *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={specForm.title}
                      onChange={handleInputChange}
                      placeholder="Məs. Rəng"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Tip *
                    </label>
                    <select
                      name="type"
                      value={specForm.type}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Tip seçin</option>
                      <option value="select">Select</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="text">Text</option>
                    </select>
                  </div>

                  {/* Unit - yalnız number tipi üçün görünür */}
                  {specForm.type === "number" && (
                    <div>
                      <label className="block text-sm font-medium text-[#5C4977] mb-2">
                        Unit (Ölçü Vahidi) <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="unit"
                        value={specForm.unit}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                        disabled={unitsLoading}
                        required
                      >
                        <option value="">Unit seçin</option>
                        {units.map((unit) => (
                          <option key={unit._id} value={unit._id}>
                            {unit.title} ({unit.name})
                          </option>
                        ))}
                      </select>
                      {unitsLoading && (
                        <p className="text-sm text-gray-500 mt-1">Unit-lər yüklənir...</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Select Values - yalnız select tipi üçün */}
                {specForm.type === "select" && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-[#5C4977]">
                        Dəyərlər (Ad və Başlıq) <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddSelectValue}
                        className="px-4 py-2 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-colors text-sm font-medium"
                      >
                        + Əlavə et
                      </button>
                    </div>
                    <div className="space-y-4">
                      {selectValueFields.map((field) => (
                        <div key={field.tempId} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 border border-[#5C4977]/20 rounded-xl">
                          <div className="col-span-5">
                            <label className="block text-sm font-medium text-[#5C4977] mb-2">
                              Ad *
                            </label>
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => handleSelectValueChange(field.tempId, "name", e.target.value)}
                              placeholder="Məs. qirmizi"
                              className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                            />
                          </div>
                          <div className="col-span-5">
                            <label className="block text-sm font-medium text-[#5C4977] mb-2">
                              Başlıq *
                            </label>
                            <input
                              type="text"
                              value={field.title}
                              onChange={(e) => handleSelectValueChange(field.tempId, "title", e.target.value)}
                              placeholder="Məs. Qırmızı"
                              className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                            />
                          </div>
                          <div className="col-span-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveSelectValue(field.tempId)}
                              className="w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      ))}
                      {selectValueFields.length === 0 && (
                        <p className="text-sm text-gray-500 italic">Heç bir dəyər əlavə edilməyib. "+ Əlavə et" düyməsinə klikləyin.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Əlavə parametrlər */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  Əlavə Parametrlər
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="isFilterable"
                      id="isFilterable"
                      checked={specForm.isFilterable}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#5C4977] border-[#5C4977]/20 rounded focus:ring-2 focus:ring-[#5C4977] cursor-pointer"
                    />
                    <label htmlFor="isFilterable" className="text-sm font-medium text-[#5C4977] cursor-pointer">
                      Filtr kimi istifadə et
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="status"
                      id="status"
                      checked={specForm.status}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#5C4977] border-[#5C4977]/20 rounded focus:ring-2 focus:ring-[#5C4977] cursor-pointer"
                    />
                    <label htmlFor="status" className="text-sm font-medium text-[#5C4977] cursor-pointer">
                      Aktiv
                    </label>
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
                  'Xüsusiyyəti Əlavə Et'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateSpec;





