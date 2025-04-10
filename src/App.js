import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/product/description/:id" element={<ProductDescriptionPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/verify-email" element={<VerificationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/staff" element={<Dashboard />}>
            <Route path="overview" element={<Overview />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="addProduct" element={<AddProductForm />} />
            <Route path="orders" element={<Orders />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route index element={<Overview />} />
            <Route path="products/edit/:id" element={<EditProductFormPage />} />     

          </Route>
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
