import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Suspense, lazy } from 'react'

// Pages
import Home from './pages/Home'
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const PromotionDetail = lazy(() => import('./pages/PromotionDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const Checkout = lazy(() => import('./pages/Checkout'))
const MyOrders = lazy(() => import('./pages/MyOrders'))
const OrderDetail = lazy(() => import('./pages/OrderDetail'))
const SearchResults = lazy(() => import('./pages/SearchResults'))

// Auth / account
const RegisterForm = lazy(() => import('./components/Register'))
const LoginForm = lazy(() => import('./components/Login'))
const ForgotPassword = lazy(() => import('./components/ForgotPassword'))
const ResetPassword = lazy(() => import('./components/ResetPassword'))
const EmailVerification = lazy(() => import('./components/EmailVerification'))
const PasswordResetRedirect = lazy(() => import('./components/PasswordResetRedirect'))

// Admin Components
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const AddProducts = lazy(() => import('./components/admin/AddProducts'))
const AdminProducts = lazy(() => import('./components/admin/AdminProducts'))
const EditProduct = lazy(() => import('./components/admin/EditProduct'))
const AdminBlog = lazy(() => import('./components/admin/AdminBlog'))
const AddBlogs = lazy(() => import('./components/admin/AddBlogs'))
const EditBlog = lazy(() => import('./components/admin/EditBlog'))
const AdminPromotion = lazy(() => import('./components/admin/AdminPromotion'))
const AddPromotion = lazy(() => import('./components/admin/AddPromotion'))
const EditPromotion = lazy(() => import('./components/admin/EditPromotion'))
const AdminUsers = lazy(() => import('./components/admin/AdminUsers'))
const EditUser = lazy(() => import('./components/admin/EditUser'))
const AdminSettings = lazy(() => import('./components/admin/AdminSettings'))
const AdminOrders = lazy(() => import('./components/admin/AdminOrders'))
const CategoryManagement = lazy(() => import('./components/admin/CategoryManagement'))
const CreateCategory = lazy(() => import('./components/admin/CreateCategory'))
const EditCategory = lazy(() => import('./components/admin/EditCategory'))
const CreateSubcategory = lazy(() => import('./components/admin/CreateSubcategory'))
const EditSubcategory = lazy(() => import('./components/admin/EditSubcategory'))
const BrandManagement = lazy(() => import('./components/admin/BrandManagement'))
const CreateBrand = lazy(() => import('./components/admin/CreateBrand'))
const EditBrand = lazy(() => import('./components/admin/EditBrand'))
const SpecsManagement = lazy(() => import('./components/admin/SpecsManagement'))
const CreateSpec = lazy(() => import('./components/admin/CreateSpec'))
const EditSpec = lazy(() => import('./components/admin/EditSpec'))
const ProductAttributes = lazy(() => import('./components/admin/ProductAttributes'))
const CreateUnit = lazy(() => import('./components/admin/CreateUnit'))
const EditUnit = lazy(() => import('./components/admin/EditUnit'))
const AdminContents = lazy(() => import('./components/admin/AdminContents'))
const EditPageContent = lazy(() => import('./components/admin/EditPageContent'))
const EditHero = lazy(() => import('./components/admin/EditHero'))
const AdminShoppingEvent = lazy(() => import('./components/admin/AdminShoppingEvent'))

import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import AdminRoute from './components/AdminRoues'

const ProductDetail = lazy(() => import('./components/ProductDetail'))
const Profile = lazy(() => import('./components/Profile'))
const SebetCart = lazy(() => import('./components/ShoppingCard'))
const FavoriteButton = lazy(() => import('./components/Favorites'))
const UpdateName = lazy(() => import('./components/Uptade'))

// ⭐ Filter Page (kategoriya + subcategory + dynamic breadcrumb)
const Filter = lazy(() => import('./components/Filter'))

// ScrollToTop Component
import ScrollToTop from './components/ui/ScrollToTop'
const Promosiyalar = lazy(() => import('./components/Promotions'))
import NotFound from './components/NotFound'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} theme="light" />

        <Suspense fallback={<div />}>
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

            {/* Product Detail - slug only */}
            <Route path="/product/:slug" element={<ProductDetail />} />

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

            <Route path='/admin/product-attributes' element={
              <AdminRoute>
                <ProductAttributes />
              </AdminRoute>
            } />

            <Route path='/admin/units/create' element={
              <AdminRoute>
                <CreateUnit />
              </AdminRoute>
            } />

            <Route path='/admin/units/edit/:id' element={
              <AdminRoute>
                <EditUnit />
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

            <Route path='/admin/contents' element={
              <AdminRoute>
                <AdminContents />
              </AdminRoute>
            } />

            <Route path='/admin/contents/home/edit' element={
              <AdminRoute>
                <EditPageContent />
              </AdminRoute>
            } />

            <Route path='/admin/edit-hero/:id' element={
              <AdminRoute>
                <EditHero />
              </AdminRoute>
            } />

            <Route path='/admin/shopping-event' element={
              <AdminRoute>
                <AdminShoppingEvent />
              </AdminRoute>
            } />

            {/* 404 Not Found - Catch-all route must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App