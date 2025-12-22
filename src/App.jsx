import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'

// Pages
import Home from './pages/Home'
import BlogDetail from './pages/BlogDetail'
import PromotionDetail from './pages/PromotionDetail'
import Contact from './pages/Contact'
import RegisterForm from './components/Register'
import LoginForm from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import EmailVerification from './components/EmailVerification'
import PasswordResetRedirect from './components/PasswordResetRedirect'

// Admin Components
import AddProducts from './components/admin/AddProducts'
import AdminProducts from './components/admin/AdminProducts'
import EditProduct from './components/admin/EditProduct'
import AdminBlog from './components/admin/AdminBlog'
import AddBlogs from './components/admin/AddBlogs'
import EditBlog from './components/admin/EditBlog'
import AdminPromotion from './components/admin/AdminPromotion'
import AddPromotion from './components/admin/AddPromotion'
import EditPromotion from './components/admin/EditPromotion'
import AdminUsers from './components/admin/AdminUsers'
import EditUser from './components/admin/EditUser'
import AdminSettings from './components/admin/AdminSettings'
import AdminOrders from './components/admin/AdminOrders'
import CategoryManagement from './components/admin/CategoryManagement'
import CreateCategory from './components/admin/CreateCategory'
import EditCategory from './components/admin/EditCategory'
import CreateSubcategory from './components/admin/CreateSubcategory'
import EditSubcategory from './components/admin/EditSubcategory'
import BrandManagement from './components/admin/BrandManagement'
import CreateBrand from './components/admin/CreateBrand'
import EditBrand from './components/admin/EditBrand'
import SpecsManagement from './components/admin/SpecsManagement'
import CreateSpec from './components/admin/CreateSpec'
import EditSpec from './components/admin/EditSpec'
import AdminHero from './components/admin/AdminHero'
import AddHero from './components/admin/AddHero'
import EditHero from './components/admin/EditHero'

import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import AdminRoute from './components/AdminRoues'

import ProductDetail from './components/ProductDetail'
import Profile from './components/Profile'
import SebetCart from './components/ShoppingCard'
import FavoriteButton from './components/Favorites'
import UpdateName from './components/Uptade'
import Checkout from './pages/Checkout' // ✅ CHECKOUT IMPORT EDİN
import MyOrders from './pages/MyOrders' // ✅ MY ORDERS IMPORT EDİN
import OrderDetail from './pages/OrderDetail' // ✅ ORDER DETAIL IMPORT EDİN

// ⭐ Filter Page (kategoriya + subcategory + dynamic breadcrumb)
import Filter from './components/Filter'
import SearchResults from './pages/SearchResults'

import AdminDashboard from './components/admin/AdminDashboard'

// ScrollToTop Component
import ScrollToTop from './components/ui/ScrollToTop'
import Promosiyalar from './components/Promotions'

// Global redirect komponenti - vercel.app-dən magazam.az-ə yönləndirir
const GlobalRedirect = () => {
  useEffect(() => {
    // Əgər vercel.app-dədirsə, magazam.az-ə yönləndir
    if (window.location.hostname.includes('vercel.app')) {
      const currentPath = window.location.pathname + window.location.search;
      const newUrl = `https://magazam.az${currentPath}`;
      console.log('Global redirect: vercel.app -> magazam.az:', newUrl);
      window.location.replace(newUrl);
    }
  }, []);
  
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <GlobalRedirect />
      <ScrollToTop />
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} theme="light" />

        <Routes>
          {/* ====================== PUBLIC ROUTES ====================== */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<PublicRoute><RegisterForm /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Password Reset Routes - YUXARIDA OLMALIDIR, digər route-lardan əvvəl */}
          <Route path="/password/reset/token/:token" element={<ResetPassword />} />
          
          {/* Köhnə format linkləri üçün redirect (crud/v1/password/reset/token/...) */}
          <Route path="/crud/v1/password/reset/token/:token" element={<PasswordResetRedirect />} />
          
          {/* Email Verification Routes (6 rəqəmli kod sistemi) */}
          <Route path="/email/verify/resend" element={<EmailVerification />} />
          
          {/* Catch-all route for crud paths - SONDA OLMALIDIR */}
          <Route path="/crud/*" element={<PasswordResetRedirect />} />

          {/* Product Detail */}
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Search Results */}
          <Route path="/search-results" element={<SearchResults />} />

          {/* Blog Detail */}
          <Route path="/blogs/:slug" element={<BlogDetail />} />

          {/* Promotion Detail */}
          <Route path="/promotions/:slug" element={<PromotionDetail />} />

          {/* Contact */}
          <Route path="/contact" element={<Contact />} />

          {/* Profile & User Routes */}
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/favourites" element={<PrivateRoute><FavoriteButton /></PrivateRoute>} />
          <Route path="/update" element={<PrivateRoute><UpdateName /></PrivateRoute>} />
          <Route path="/shopping-cart" element={<PrivateRoute><SebetCart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
          <Route path="/order/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />

          {/* ====================== FILTER ROUTES (YENİ) ====================== */}
          {/* No category → bütün məhsullar */}
          <Route path="/catalog" element={<Filter />} />

            <Route path="/promotions" element={<Promosiyalar />} />

          {/* Category seçilib */}
          <Route path="/catalog/:category" element={<Filter />} />

          {/* Category + Subcategory */}
          <Route path="/catalog/:category/:subcategory" element={<Filter />} />


          {/* ====================== ADMIN ROUTES ====================== */}
          <Route path='/admin' element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          <Route path='/admin/add-products' element={
            <AdminRoute>
              <AddProducts />
            </AdminRoute>
          } />

          <Route path='/admin/products' element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />

          <Route path='/admin/edit-product/:id' element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          } />

          <Route path='/admin/admin-blogs' element={
            <AdminRoute>
              <AdminBlog />
            </AdminRoute>
          } />

          <Route path='/admin/add-blog' element={
            <AdminRoute>
              <AddBlogs />
            </AdminRoute>
          } />

          <Route path='/admin/edit-blog/:id' element={
            <AdminRoute>
              <EditBlog />
            </AdminRoute>
          } />

          <Route path='/admin/promotions' element={
            <AdminRoute>
              <AdminPromotion />
            </AdminRoute>
          } />

          <Route path='/admin/add-promotion' element={
            <AdminRoute>
              <AddPromotion />
            </AdminRoute>
          } />

          <Route path='/admin/edit-promotion/:id' element={
            <AdminRoute>
              <EditPromotion />
            </AdminRoute>
          } />

          <Route path='/admin/users' element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />

          <Route path='/admin/edit-user/:id' element={
            <AdminRoute>
              <EditUser />
            </AdminRoute>
          } />

          <Route path='/admin/categories' element={
            <AdminRoute>
              <CategoryManagement />
            </AdminRoute>
          } />

          <Route path='/admin/categories/create' element={
            <AdminRoute>
              <CreateCategory />
            </AdminRoute>
          } />

          <Route path='/admin/categories/edit/:id' element={
            <AdminRoute>
              <EditCategory />
            </AdminRoute>
          } />

          <Route path='/admin/categories/:categoryId/subcategories/create' element={
            <AdminRoute>
              <CreateSubcategory />
            </AdminRoute>
          } />

          <Route path='/admin/categories/:categoryId/subcategories/edit/:subcategoryId' element={
            <AdminRoute>
              <EditSubcategory />
            </AdminRoute>
          } />

          <Route path='/admin/brands' element={
            <AdminRoute>
              <BrandManagement />
            </AdminRoute>
          } />

          <Route path='/admin/brands/create' element={
            <AdminRoute>
              <CreateBrand />
            </AdminRoute>
          } />

          <Route path='/admin/brands/edit/:id' element={
            <AdminRoute>
              <EditBrand />
            </AdminRoute>
          } />

          <Route path='/admin/specs' element={
            <AdminRoute>
              <SpecsManagement />
            </AdminRoute>
          } />

          <Route path='/admin/specs/create' element={
            <AdminRoute>
              <CreateSpec />
            </AdminRoute>
          } />

          <Route path='/admin/specs/edit/:id' element={
            <AdminRoute>
              <EditSpec />
            </AdminRoute>
          } />

          <Route path='/admin/settings' element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          } />

          <Route path='/admin/orders' element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />

          <Route path='/admin/heroes' element={
            <AdminRoute>
              <AdminHero />
            </AdminRoute>
          } />

          <Route path='/admin/add-hero' element={
            <AdminRoute>
              <AddHero />
            </AdminRoute>
          } />

          <Route path='/admin/edit-hero/:id' element={
            <AdminRoute>
              <EditHero />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App