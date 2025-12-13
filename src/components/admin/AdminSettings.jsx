import React, { useState, useEffect } from "react";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "../../redux/api/settingsApi";
import Swal from "sweetalert2";
import AdminLayout from "./AdminLayout";
import { Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Youtube, Link as LinkIcon } from "lucide-react";

const AdminSettings = () => {
  const { data, isLoading } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  const [formData, setFormData] = useState({
    phone: "",
    whatsappPhone: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
    googleMapsLink: "",
    googleMapsEmbed: "",
  });

  useEffect(() => {
    if (data?.settings) {
      const settings = data.settings;
      setFormData({
        phone: settings.phone || "",
        whatsappPhone: settings.whatsappPhone || "",
        email: settings.email || "",
        address: settings.address || "",
        facebook: settings.facebook || "",
        instagram: settings.instagram || "",
        linkedin: settings.linkedin || "",
        twitter: settings.twitter || "",
        youtube: settings.youtube || "",
        googleMapsLink: settings.googleMapsLink || "",
        googleMapsEmbed: settings.googleMapsEmbed || "",
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateSettings(formData).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Tənzimləmələr uğurla yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
      });
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Tənzimləmələr yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Tənzimləmələr">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Tənzimləmələr">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Tənzimləmələr</h1>
            <p className="text-gray-600">Sayt tənzimləmələrini idarə edin</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Əlaqə məlumatları */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Əlaqə Məlumatları
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Telefon
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+994 XX XXX XX XX"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      WhatsApp Telefonu
                    </label>
                    <input
                      type="text"
                      name="whatsappPhone"
                      value={formData.whatsappPhone}
                      onChange={handleInputChange}
                      placeholder="+994 XX XXX XX XX"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      E-poçt
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="info@example.com"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Ünvan
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Ünvan daxil edin"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Sosial şəbəkələr */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <Facebook className="h-5 w-5" />
                  Sosial Şəbəkələr
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2 flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      placeholder="https://facebook.com/..."
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2 flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/..."
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2 flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/..."
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2 flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/..."
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2 flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </label>
                    <input
                      type="url"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/..."
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Google Maps
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2 flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Google Maps Keçidi
                    </label>
                    <input
                      type="url"
                      name="googleMapsLink"
                      value={formData.googleMapsLink}
                      onChange={handleInputChange}
                      placeholder="https://maps.google.com/..."
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Google Maps linki (açıq keçid)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Google Maps Yerləşmə Embed Linki
                    </label>
                    <input
                      type="url"
                      name="googleMapsEmbed"
                      value={formData.googleMapsEmbed}
                      onChange={handleInputChange}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Google Maps embed linki
                    </p>
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

export default AdminSettings;
