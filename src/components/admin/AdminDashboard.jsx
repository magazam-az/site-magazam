import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LogOut,
  Bell,
  Home,
  Plus,
  Edit,
  UserCheck,
  Tag // 🔥 Promotions icon
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlice';
import { useLazyLogoutQuery } from '../../redux/api/authApi';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [triggerLogout] = useLazyLogoutQuery();

  // User data from Redux
  const userState = useSelector(
    state => state.user || state.userSlice || state.auth
  );
  const { user } = userState || {};

  // 🔥 Quick Actions (Promotions əlavə olundu)
  const quickActions = [
    {
      icon: <Plus size={20} />,
      label: 'Məhsul əlavə et',
      path: '/admin/add-products',
    },
    {
      icon: <Edit size={20} />,
      label: 'Məhsulları idarə et',
      path: '/admin/products',
    },
    {
      icon: <FileText size={20} />,
      label: 'Bloq yazısı əlavə et',
      path: '/admin/add-blog',
    },
    {
      icon: <UserCheck size={20} />,
      label: 'İstifadəçilər',
      path: '/admin/users',
    },
    {
      icon: <Tag size={20} />,
      label: 'Promotions',
      path: '/admin/promotions',
    },
  ];

  // User helpers
  const getUserName = () =>
    user?.user?.name || user?.name || user?.username || 'Admin';

  const getUserEmail = () =>
    user?.user?.email || user?.email || 'admin@example.com';

  const getUserAvatar = () =>
    user?.user?.avatar?.url ||
    user?.avatar?.url ||
    user?.profilePicture ||
    '';

  const getUserRole = () =>
    user?.user?.role || user?.role || 'admin';

  // Logout
  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(logout());
      navigate('/');
    }
  };

  // Admin check
  useEffect(() => {
    if (getUserRole() !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <AdminLayout pageTitle="Dashboard">
      <div className="bg-gray-50 min-h-full p-6">

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            İdarəetmə Paneli
          </h2>
          <p className="text-gray-500">
            Admin Dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Tez Hərəkətlər
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-200
                           hover:shadow-md transition-all duration-200
                           flex flex-col items-center justify-center text-center
                           hover:border-[#5C4977] group cursor-pointer"
              >
                <div className="p-3 bg-[#5C4977]/10 rounded-lg mb-3
                                group-hover:bg-[#5C4977]/20 transition-colors">
                  <div className="text-[#5C4977]">
                    {action.icon}
                  </div>
                </div>

                <span className="font-medium text-gray-800
                                 group-hover:text-[#5C4977] transition-colors">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
