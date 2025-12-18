import React from 'react';
import { useGetSettingsQuery } from '../redux/api/settingsApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const { data, isLoading } = useGetSettingsQuery();
  const settings = data?.settings || {};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <section className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
          {/* Breadcrumb */}
          <div className="py-6 pb-0">
            <Breadcrumb 
              items={[
                { label: "Ana səhifə", path: "/" },
                { label: "Bizimlə Əlaqə" }
              ]}
            />
          </div>

          {/* Google Maps ve Contact Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Google Maps - Sol taraf (2/3 genişlik) */}
            <div className="lg:col-span-2">
              {settings.googleMapsEmbed && (
                <div className="w-full" style={{ height: '400px' }}>
                  <iframe
                    src={settings.googleMapsEmbed}
                    className="w-full h-full rounded-xl shadow-lg border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                  />
                </div>
              )}
            </div>

            {/* Need a Help? və Subscribe us Kartı - Sağ taraf (1/3 genişlik) */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
              {/* Need a Help? Section */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need a Help?</h3>
              <div className="space-y-3 mb-6">
                {/* Telefon */}
                {settings.phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <a 
                      href={`tel:${settings.phone}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {settings.phone}
                    </a>
                  </div>
                )}

                {/* WhatsApp */}
                {settings.whatsappPhone && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full flex-shrink-0">
                      <FaWhatsapp className="w-5 h-5 text-green-600" />
                    </div>
                    <a 
                      href={`https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-600 transition-colors text-sm"
                    >
                      {settings.whatsappPhone}
                    </a>
                  </div>
                )}

                {/* Email */}
                {settings.email && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full flex-shrink-0">
                      <Mail className="w-5 h-5 text-orange-600" />
                    </div>
                    <a 
                      href={`mailto:${settings.email}`}
                      className="text-gray-600 hover:text-orange-600 transition-colors text-sm break-all"
                    >
                      {settings.email}
                    </a>
                  </div>
                )}

                {/* Ünvan */}
                {settings.address && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full flex-shrink-0">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-gray-600 text-sm">{settings.address}</span>
                  </div>
                )}
              </div>

              {/* Subscribe us Section */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">Abone ol</h3>
              <div className="flex items-center gap-3 flex-wrap">
                {settings.facebook && (
                  <a 
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                )}
                {settings.twitter && (
                  <a 
                    href={settings.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-black rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                )}
                {settings.instagram && (
                  <a 
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                )}
                {settings.linkedin && (
                  <a 
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-blue-700 rounded-full hover:bg-blue-800 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                )}
                {settings.youtube && (
                  <a 
                    href={settings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Youtube className="w-5 h-5 text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;

