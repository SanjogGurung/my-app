import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './redux/store';
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/staff/Dashboard';
import LoginPage from './pages/LoginPage';
import RegistrationForm from './pages/RegistrationForm';
import ProductDescriptionPage from './pages/ProductDescriptionPage';
import CartPage from './pages/CartPage';
import { Overview } from './pages/staff/Dashboard';
import { Users } from './pages/staff/Dashboard';
import AddProductForm from './pages/staff/components/AddProductForm';
import UsersList from './pages/staff/components/UsersList';
import { Products } from './pages/staff/Dashboard';
import EditProductFormPage from './pages/staff/EditProductFormPage';
import Wallpapers from './pages/staff/components/Wallpapers';
import ProtectedRoute from './ProtectedRoute';
import { setStore } from './axiosConfig'; // Import setStore
import Root from './Root.js';
import Checkout from './pages/Checkout.js';
import CheckoutVerify from './pages/CheckoutVerify.js';
import ProductsPage from './pages/ProductsPage.js';
import VerificationPage from './pages/VerificationPage.js';

setStore(store);

const router = createBrowserRouter([
  {
    element: <Root />, // Initializes auth
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          { path: '', element: <HomePage /> },
          { path: 'home', element: <HomePage /> },
          {path :'products', element: <ProductsPage /> },
          { path: 'product/description/:id', element: <ProductDescriptionPage /> },

          {
            element: <ProtectedRoute />,
            children: [
              { path: 'profile', element: <UserProfile /> },
              { path: 'cart', element: <CartPage /> },
              { path: 'checkout', element: <Checkout />},
              { path: 'verify/:pidx', element: <CheckoutVerify />},
              { path: 'checkout/verify', element: <CheckoutVerify /> }, // Updated route

            ],
          },
        ],
      },
      {
        path: '/staff',
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <Dashboard />,
            children: [
              { path: '', element: <Overview /> },
              { path: 'overview', element: <Overview /> },
              { path: 'users', element: <UsersList /> },
              { path: 'addProduct', element: <AddProductForm /> },
              { path: 'products', element: <Products /> },
              { path: 'products/edit/:id', element: <EditProductFormPage /> },
              { path: 'addWallpaper', element: <Wallpapers /> },
            ],
          },
        ],
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegistrationForm />,
      },
      {
        path:'verify-email',
        element: <VerificationPage />
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
