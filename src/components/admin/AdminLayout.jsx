import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Home,
  Tag,
  Award,
  Sliders,
  Percent,
  FolderOpen,
  Calendar
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlice';
import { useLazyLogoutQuery } from '../../redux/api/authApi';

const AdminLayout = ({ children, pageTitle = "Admin Panel" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [triggerLogout] = useLazyLogoutQuery();

  // User data from Redux
  const userState = useSelector(state => state.user || state.userSlice || state.auth);
  const { user } = userState || {};

  // Get user info safely
  const getUserName = () => {
    return user?.user?.name || user?.name || user?.username || "Admin"
  }

  const getUserEmail = () => {
    return user?.user?.email || user?.email || "admin@example.com"
  }

  const getUserAvatar = () => {
    return user?.user?.avatar?.url || user?.avatar?.url || user?.profilePicture || ""
  }

  const getUserRole = () => {
    return user?.user?.role || user?.role || "admin"
  }

  // Logout function
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

  // Check if current path matches (including subpaths)
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
              <BarChart3 className="text-[#5C4977]" />
              <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            </Link>
            <p className="text-sm text-gray-500 mt-1">İdarəetmə Paneli</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link
              to="/admin"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                location.pathname === '/admin'
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <Home size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/admin/products"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/products')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <Package size={20} />
              <span className="font-medium">Məhsullar</span>
            </Link>

            <Link
              to="/admin/categories"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/categories')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <Tag size={20} />
              <span className="font-medium">Kateqoriyalar</span>
            </Link>

            <Link
              to="/admin/brands"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/brands')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <Award size={20} />
              <span className="font-medium">Brendlər</span>
            </Link>

            <Link
              to="/admin/specs"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/specs')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <Sliders size={20} />
              <span className="font-medium">Xüsusiyyətlər</span>
            </Link>

            <Link
              to="/admin/product-attributes"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/product-attributes')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <Package size={20} />
              <span className="font-medium">Məhsul Attributes</span>
            </Link>

            <Link
              to="/admin/promotions"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/promotions')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <Percent size={20} />
              <span className="font-medium">Promosiyalar</span>
            </Link>

            <Link
              to="/admin/contents"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/contents')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <FolderOpen size={20} />
              <span className="font-medium">Kontentlər</span>
            </Link>

            <Link
              to="/admin/orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/orders')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <ShoppingCart size={20} />
              <span className="font-medium">Sifarişlər</span>
            </Link>

            <Link
              to="/admin/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/users')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <Users size={20} />
              <span className="font-medium">İstifadəçilər</span>
            </Link>

            <Link
              to="/admin/admin-blogs"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/admin-blogs')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <FileText size={20} />
              <span className="font-medium">Bloq</span>
            </Link>

            <Link
              to="/admin/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive('/admin/settings')
                  ? 'bg-[#5C4977] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'
              }`}
            >
              <Settings size={20} />
              <span className="font-medium">Tənzimləmələr</span>
            </Link>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors w-full font-medium cursor-pointer"
            >
              <LogOut size={20} />
              <span>Çıxış</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main content */}
      <main className={`lg:ml-64 pt-16 lg:pt-0 h-screen flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{pageTitle}</h2>
                <p className="text-gray-600">Xoş gəlmisiniz, {getUserName()} 👋</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  {getUserAvatar() ? (
                    <img
                      src={getUserAvatar()}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-cover rounded-full border-2 border-[#5C4977]"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-[#5C4977] to-[#8B699B] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getUserName().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[120px]">{getUserName()}</p>
                    <p className="text-xs text-gray-500">
                      {getUserRole() === "admin" ? "Admin" : "İstifadəçi"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;