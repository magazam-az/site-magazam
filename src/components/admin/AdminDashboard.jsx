import React, { useState } from 'react';
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
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  Edit,
  ShoppingBag,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlice'; // Fixed path
import { useLazyLogoutQuery } from '../../redux/api/authApi'; // Fixed path

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [triggerLogout] = useLazyLogoutQuery();

  // Fərqli store strukturları üçün useSelector - NAVBAR-DAKI KİMİ
  const userState = useSelector(state => state.user || state.userSlice || state.auth);
  const { user, isAuthenticated } = userState || {};

  // Mock data for dashboard stats
  const [stats] = useState({
    totalRevenue: 45231.89,
    totalOrders: 2345,
    totalProducts: 156,
    totalUsers: 892,
    revenueGrowth: 12.5,
    orderGrowth: 8.2,
    userGrowth: 5.7
  });

  // Recent orders mock data
  const recentOrders = [
    { id: 1, customer: 'Ali Məmmədov', amount: 149.99, status: 'Completed', date: '2024-01-15' },
    { id: 2, customer: 'Ayşə Quliyeva', amount: 89.99, status: 'Pending', date: '2024-01-15' },
    { id: 3, customer: 'Kərim Həsənov', amount: 299.99, status: 'Processing', date: '2024-01-14' },
    { id: 4, customer: 'Leyla Rzayeva', amount: 199.99, status: 'Completed', date: '2024-01-14' },
    { id: 5, customer: 'Rəşad İbrahimov', amount: 79.99, status: 'Cancelled', date: '2024-01-13' },
  ];

  // Top products mock data
  const topProducts = [
    { id: 1, name: 'iPhone 15 Pro', sales: 234, revenue: 35000 },
    { id: 2, name: 'Samsung Galaxy S23', sales: 189, revenue: 28000 },
    { id: 3, name: 'AirPods Pro', sales: 456, revenue: 12000 },
    { id: 4, name: 'MacBook Air', sales: 78, revenue: 31000 },
    { id: 5, name: 'PlayStation 5', sales: 145, revenue: 22000 },
  ];

  // Quick actions - only keep functional ones
  const quickActions = [
    { icon: <Plus size={20} />, label: 'Məhsul əlavə et', path: '/admin/add-products' },
    { icon: <Edit size={20} />, label: 'Məhsulları idarə et', path: '/admin/adminproducts' },
    { icon: <FileText size={20} />, label: 'Bloq yazısı əlavə et', path: '/admin/add-blog' },
    { icon: <UserCheck size={20} />, label: 'İstifadəçilər', path: '/admin/users' },
  ];

  // Get user info safely - NAVBAR-DAKI EYNİ FUNKSİYALAR
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

  // Əgər user state undefined-dırsa, default dəyərlər istifadə et
  const safeIsAuthenticated = isAuthenticated || false
  const safeUser = user || {}

  // Logout function - NAVBAR-DAKI EYNİ LOGİKA
  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, still logout locally
      dispatch(logout());
      navigate('/');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('az-AZ', {
      minimumFractionDigits: 2
    }).format(amount) + ' ₼';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Check if user is admin - if not, redirect to home
  React.useEffect(() => {
    const userRole = getUserRole();
    if (userRole !== "admin") {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-[#5C4977]" />
              Admin Panel
            </h1>
            <p className="text-sm text-gray-500 mt-1">İdarəetmə Paneli</p>
          </div>

          {/* User info - NAVBAR-DAKI MƏLUMATLAR İLƏ */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {getUserAvatar() ? (
                <img
                  src={getUserAvatar()}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-full border-2 border-[#5C4977]"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-[#5C4977] to-[#8B699B] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {getUserName().charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800">{getUserName()}</h3>
                <p className="text-sm text-gray-500 truncate max-w-[150px]">{getUserEmail()}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-[#5C4977]/10 text-[#5C4977] rounded-full font-medium">
                  {getUserRole() === "admin" ? "Admin" : "İstifadəçi"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-[#5C4977] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-[#5C4977]'}`}
            >
              <Home size={20} />
              <span className="font-medium">Dashboard</span>
            </button>

            <Link
              to="/admin/adminproducts"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <Package size={20} />
              <span className="font-medium">Məhsullar</span>
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <ShoppingCart size={20} />
              <span className="font-medium">Sifarişlər</span>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <Users size={20} />
              <span className="font-medium">İstifadəçilər</span>
            </Link>

            <Link
              to="/admin/admin-blogs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <FileText size={20} />
              <span className="font-medium">Bloq</span>
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#5C4977] transition-all duration-200"
            >
              <Settings size={20} />
              <span className="font-medium">Tənzimləmələr</span>
            </Link>
          </nav>

          {/* Logout button - NAVBAR-DAKI LOGOUT SİSTEMİ İLƏ */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors w-full font-medium"
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
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
      <main className={`lg:ml-64 pt-16 lg:pt-0 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top bar - NAVBAR-DAKI USER MƏLUMATLARI İLƏ */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600">Xoş gəlmisiniz, {getUserName()} 👋</p>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Bell size={22} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
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

        {/* Stats cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Ümumi Gəlir</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(stats.totalRevenue)}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-sm text-green-600 font-medium">+{stats.revenueGrowth}%</span>
                    <span className="text-sm text-gray-500">keçən aydan</span>
                  </div>
                </div>
                <div className="p-3 bg-[#5C4977]/10 rounded-lg">
                  <DollarSign size={24} className="text-[#5C4977]" />
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Ümumi Sifariş</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.totalOrders.toLocaleString()}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-sm text-green-600 font-medium">+{stats.orderGrowth}%</span>
                    <span className="text-sm text-gray-500">keçən aydan</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <ShoppingCart size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Məhsullar</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.totalProducts}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <Eye size={16} className="text-[#5C4977]" />
                    <span className="text-sm text-gray-500">aktiv məhsullar</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Package size={24} className="text-purple-600" />
                </div>
              </div>
            </div>

            {/* Users Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">İstifadəçilər</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.totalUsers.toLocaleString()}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-sm text-green-600 font-medium">+{stats.userGrowth}%</span>
                    <span className="text-sm text-gray-500">keçən aydan</span>
                  </div>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg">
                  <Users size={24} className="text-pink-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tez Hərəkətlər</h3>
              <Link to="/admin/actions" className="text-sm text-[#5C4977] hover:text-[#4a3d62] font-medium flex items-center gap-1">
                Hamısına bax <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center hover:border-[#5C4977] group"
                >
                  <div className="p-3 bg-[#5C4977]/10 rounded-lg mb-3 group-hover:bg-[#5C4977]/20 transition-colors">
                    <div className="text-[#5C4977]">{action.icon}</div>
                  </div>
                  <span className="font-medium text-gray-800 group-hover:text-[#5C4977] transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Orders and Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Son Sifarişlər</h3>
                  <Link to="/admin/orders" className="text-sm text-[#5C4977] hover:text-[#4a3d62] font-medium flex items-center gap-1">
                    Hamısına bax <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müştəri</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Məbləğ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{formatCurrency(order.amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Ən Çox Satılan Məhsullar</h3>
                  <Link to="/admin/adminproducts" className="text-sm text-[#5C4977] hover:text-[#4a3d62] font-medium flex items-center gap-1">
                    Hamısına bax <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {topProducts.map((product) => (
                  <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{product.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{product.sales} satış</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{formatCurrency(product.revenue)}</p>
                        <p className="text-sm text-gray-500">ümumi gəlir</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#5C4977] to-[#8B699B] h-2 rounded-full"
                          style={{ width: `${Math.min((product.sales / 500) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Son Fəaliyyət</h3>
                <Link to="/admin/activity" className="text-sm text-[#5C4977] hover:text-[#4a3d62] font-medium flex items-center gap-1">
                  Ətraflı <ChevronRight size={16} />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { action: 'Yeni məhsul əlavə edildi', user: getUserName(), time: '2 saat əvvəl', icon: <Plus size={16} className="text-green-500" /> },
                  { action: 'Sifariş təsdiqləndi', user: 'Sistem', time: '4 saat əvvəl', icon: <ShoppingBag size={16} className="text-blue-500" /> },
                  { action: 'Yeni istifadəçi qeydiyyatdan keçdi', user: 'Sistem', time: '6 saat əvvəl', icon: <UserCheck size={16} className="text-purple-500" /> },
                  { action: 'Bloq yazısı redaktə edildi', user: getUserName(), time: '1 gün əvvəl', icon: <Edit size={16} className="text-yellow-500" /> },
                  { action: 'Məhsul yeniləndi', user: getUserName(), time: '2 gün əvvəl', icon: <Package size={16} className="text-[#5C4977]" /> },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">tərəfindən {activity.user}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;