// src/pages/Profile.js
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Mail, Edit, Save, X, Package, Heart, ShoppingCart, Loader2 } from "lucide-react";
import { useUpdateProfileMutation } from "../redux/api/authApi";
import { toast } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Profile() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // RTK Query mutation for updating profile
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      // Artıq user birbaşa obyekt kimi gəlir: { name, email, ... }
      setName(user?.name || "");
      setEmail(user?.email || "");
      // Avatar preview'i user'dan al, yoksa null
      // Eğer avatar file seçilmişse ve henüz kaydedilmemişse, preview'i değiştirme
      if (!avatar) {
        setAvatarPreview(user?.avatar?.url || user?.user?.avatar?.url || null);
      }
    }
  }, [user, avatar]);
  
  // Avatar yüklendikten sonra preview'i güncelle
  useEffect(() => {
    if (avatar) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(avatar);
    }
  }, [avatar]);

  // Avatar seçimi
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      // Preview useEffect'te otomatik olarak güncellenecek
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: "error", text: "Ad boş ola bilməz" });
      return;
    }

    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("name", name);
      
      // Avatar varsa ekle
      if (avatar) {
        formData.append("avatar", avatar);
      }

      // Backend-ə FormData göndəririk
      const result = await updateProfile(formData).unwrap();

      // userSlice artıq authApi.onQueryStarted içində yenilənir
      toast.success("Profil uğurla yeniləndi!");
      setMessage({ type: "success", text: "Profil uğurla yeniləndi" });
      setIsEditing(false);
      setAvatar(null); // Reset avatar file
      
      // Avatar yüklendiyse, preview'i response'dan gelen yeni URL ile güncelle
      if (result?.user?.avatar?.url) {
        setAvatarPreview(result.user.avatar.url);
      }

      // 3 saniyədən sonra mesajı sil
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Xəta baş verdi!");
      setMessage({ type: "error", text: "Yeniləmə uğursuz oldu" });
    }
  };

  const handleCancel = () => {
    // Formu redux-dakı user dəyərlərinə qaytarırıq
    setName(user?.name || "");
    setEmail(user?.email || "");
    setAvatar(null);
    setAvatarPreview(user?.avatar?.url || null);
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-14 md:pb-0">
      <Navbar />
      
      <div className="flex-1 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profilim</h1>
            <p className="text-gray-600 mt-2">Şəxsi məlumatlarınızı idarə edin</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-[#5C4977] to-[#7B6799] px-6 py-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview}
                          alt={user?.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                          <Edit className="w-4 h-4 text-[#5C4977]" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">{user?.name}</h2>
                      <p className="text-white/80">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="p-6">
                  {message.text && (
                    <div
                      className={`mb-6 p-4 rounded-lg ${
                        message.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        Ad Soyad
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditing}
                          className={`flex-1 px-4 py-3 border rounded-xl transition-all ${
                            isEditing
                              ? "border-[#5C4977] bg-white focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        />
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="w-full sm:w-auto px-4 py-3 bg-[#5C4977] text-white rounded-xl hover:bg-[#5C4977]/90 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Düzəliş</span>
                          </button>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                              onClick={handleSave}
                              disabled={isLoading}
                              className="flex-1 sm:flex-none px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                            >
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              {!isLoading && <span>Yadda saxla</span>}
                            </button>
                            <button
                              onClick={handleCancel}
                              className="flex-1 sm:flex-none px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                            >
                              <X className="w-4 h-4" />
                              <span>Ləğv et</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email Field (Read-only) */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions */}
            <div className="flex">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sürətli Girişlər</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/my-orders")}
                    className="w-full flex items-center gap-3 p-4 text-left rounded-xl border border-gray-200 hover:border-[#5C4977] hover:bg-[#f5f2fa] transition-all group cursor-pointer"
                  >
                    <Package className="w-5 h-5 text-gray-400 group-hover:text-[#5C4977]" />
                    <div>
                      <div className="font-medium text-gray-900">Sifarişlərim</div>
                      <div className="text-sm text-gray-500">Sifariş tarixçəniz</div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/favourites")}
                    className="w-full flex items-center gap-3 p-4 text-left rounded-xl border border-gray-200 hover:border-[#5C4977] hover:bg-[#f5f2fa] transition-all group cursor-pointer"
                  >
                    <Heart className="w-5 h-5 text-gray-400 group-hover:text-[#5C4977]" />
                    <div>
                      <div className="font-medium text-gray-900">Seçilmişlər</div>
                      <div className="text-sm text-gray-500">Bəyəndiyiniz məhsullar</div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/shopping-cart")}
                    className="w-full flex items-center gap-3 p-4 text-left rounded-xl border border-gray-200 hover:border-[#5C4977] hover:bg-[#f5f2fa] transition-all group cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-[#5C4977]" />
                    <div>
                      <div className="font-medium text-gray-900">Səbət</div>
                      <div className="text-sm text-gray-500">Alış-veriş səbətiniz</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
