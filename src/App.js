import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm.js'
import VerificationPage from './pages/VerificationPage.js'
import LoginPage from './pages/LoginPage.js';
import HomePage from './pages/HomePage.js';
import Dashboard from './pages/staff/Dashboard.js';
import ProductList from './components/ProductList.js';
import AddProductForm from './pages/staff/components/AddProductForm.js';
import { Overview, Products, Categories, Brands, Orders, Users } from './pages/staff/Dashboard.js';
import EditProductFormPage from './pages/staff/EditProductFormPage.js';
import ProductDescriptionPage from './pages/ProductDescriptionPage.js';
import Wallpapers from './pages/staff/components/Wallpapers.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from './redux/slices/productsSlice.js';
import UserProfile from './pages/UserProfile.js'; 
import Navbar from './components/Navbar.js';



function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchProducts()); 
  }, [dispatch]);

  return (
    // <BrowserRouter>
    //     <Routes>
    //       <Route path="/product-list" element = {<ProductList />} />
    //       <Route path="/home" element={<HomePage />} />
    //       <Route path="/product/description/:id" element={<ProductDescriptionPage />} />
    //       <Route path="/register" element={<RegistrationForm />} />
    //       <Route path="/verify-email" element={<VerificationPage />} />
    //       <Route path="/login" element={<LoginPage />} />
    //       <Route path="/staff" element={<Dashboard />}>
    //         <Route path="overview" element={<Overview />} />
    //         <Route path="users" element={<Users />} />
    //         <Route path="products" element={<Products />} />
    //         <Route path="addProduct" element={<AddProductForm />} />
    //         <Route path="orders" element={<Orders />} />
    //         <Route path="categories" element={<Categories />} />
    //         <Route path="brands" element={<Brands />} />
    //         <Route index element={<Overview />} />
    //         <Route path="products/edit/:id" element={<EditProductFormPage />} />  
    //         <Route path="addWallpaper" element = {<Wallpapers />} />   
    //       </Route>
    //       <Route path="*" element={<HomePage />} />

    //       <Route path ="/profile" element = {<UserProfile />} />
          
    //     </Routes>
    //   </BrowserRouter>

    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
