import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/staff/Dashboard.css";
import ProductList from "../../components/ProductList.js";
import AddProductForm from "./components/AddProductForm.js";
import axios from "axios";
import { useLocation, Routes, Route, Outlet } from "react-router-dom";
import UsersList from "./components/UsersList.js";
import Wallpapers from "./components/Wallpapers.js";
import EditProductFormPage from "./EditProductFormPage.js";

// Wallpapers component with add and delete functionality

export default function Dashboard() {
  const { pathname } = useLocation();

  const [activeItem, setActiveItem] = useState(() => {
    if (pathname === "/staff/overview") return "overview";
    if (pathname === "/staff/users") return "users";
    if (pathname.startsWith("/staff/products")) return "products";
    if (pathname === "/staff/addProduct") return "addProduct";
    if (pathname === "/staff/orders") return "orders";
    if (pathname === "/staff/categories") return "categories";
    if (pathname === "/staff/brands") return "brands";
    if (pathname === "/staff/addWallpaper") return "addWallpaper";
    return "overview";
  });

  const handleClick = (item) => {
    setActiveItem(item);
  };

  const sidebarState = {
    isOverviewActive: activeItem === "overview",
    isUsersActive: activeItem === "users",
    isProductsActive: activeItem === "products",
    isOrdersActive: activeItem === "orders",
    isCategoriesActive: activeItem === "categories",
    isBrandsActive: activeItem === "brands",
    isAddProductActive: activeItem === "addProduct",
    isAddWallpaperActive: activeItem === "addWallpaper",
  };

  return (
    <div className="staff-dashboard">
      <div className="logo">SuSankhya</div>
      <div className="second-row">
        <Sidebar handleClick={handleClick} sidebarState={sidebarState} />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// Existing components (unchanged)
export function Overview({ data }) {
  return (
    <div className="overview-content">
      <h2>Overview</h2>
      {data ? (
        <div>
          <p>Overview Data:</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Welcome to the Staff Dashboard! This is the Overview section.</p>
      )}
    </div>
  );
}

export function Products() {
  return (
    <div className="products-content">
      <h2>Products</h2>
      <ProductList isStaffPanel = {true}/>
    </div>
  );
}

export function Users() {
  return <UsersList />;
}

export function Orders({ data }) {
  return (
    <div className="orders-content">
      <h2>Orders</h2>
      {data && data.items ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Track and manage orders here.</p>
      )}
    </div>
  );
}

export function Categories({ data }) {
  return (
    <div className="categories-content">
      <h2>Categories</h2>
      {data && data.items ? (
        <ul>
          {data.items.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      ) : (
        <p>Organize products by categories here.</p>
      )}
    </div>
  );
}

export function Brands({ data }) {
  return (
    <div className="brands-content">
      <h2>Brands</h2>
      {data && data.items ? (
        <ul>
          {data.items.map((brand) => (
            <li key={brand.id}>{brand.name}</li>
          ))}
        </ul>
      ) : (
        <p>Manage brands here.</p>
      )}
    </div>
  );
}