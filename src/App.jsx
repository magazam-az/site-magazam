import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages
import Home from './pages/Home'
import RegisterForm from './components/Register'
import LoginForm from './components/Login'

// Admin Components
import AddProducts from './components/admin/AddProducts'
import AdminProducts from './components/admin/AdminProducts'
import EditProduct from './components/admin/EditProduct'
import AdminBlog from './components/admin/AdminBlog'
import AddBlogs from './components/admin/AddBlogs'
import PrivateRoute from './components/PrivateRoute'
import ProductDetail from './components/ProductDetail'
import Profile from './components/Profile'
import SebetCart from './components/ShoppingCard'
import FavoriteButton from './components/Favorites'
import UpdateName from './components/Uptade'
import EcommerceApp from './components/Filter'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path='/product/:id' element= {<ProductDetail />} />
          <Route path='/profile' element= {<Profile />} />
                    <Route path="/favourites" element={<FavoriteButton />} />
                    <Route path="/update" element={<UpdateName />} />
                            <Route path="/filter" element={<EcommerceApp />} />

                    <Route path="/shoppingcard" element={< SebetCart/>} />


          
          {/* Admin Routes */}
          <Route path='/admin/add-products' element={
            <PrivateRoute>
              <AddProducts />
            </PrivateRoute>
          } />
          
          <Route path='/admin/adminproducts' element={
            <PrivateRoute>
              <AdminProducts />
            </PrivateRoute>
          } />
          
          <Route path='/admin/edit-product/:id' element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          } />
          
          <Route path='/admin/admin-blogs' element={
            <PrivateRoute>
              <AdminBlog />
            </PrivateRoute>
          } />

          <Route path='/admin/add-blog' element={
            <PrivateRoute>
              <AddBlogs />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App