import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/staff/Dashboard.css";
import ProductList from "../../components/ProductList.js";
import AddProductForm from "./components/AddProductForm.js";
import axios from "axios";
import { useLocation, Routes, Route, Outlet } from "react-router-dom";
import UsersList from "./components/UsersList.js";


export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const handleClick = (item) => {
    setActiveItem(item);
  };

  const sidebarState = {
    isOverviewActive: activeItem === "overview", // Inital True | Later False
    isUsersActive: activeItem === "users", 
    isProductsActive: activeItem === "products",
    isOrdersActive: activeItem === "orders",
    isCategoriesActive: activeItem === "categories",
    isBrandsActive: activeItem === "brands",
    isAddProductActive: activeItem === "addProduct"
  };

  // Sync activeItem with the current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/staff/overview") setActiveItem("overview");
    else if (path === "/staff/users") setActiveItem("users");
    else if (path === "/staff/products") setActiveItem("products");
    else if (path === "/staff/addProduct") setActiveItem("addProduct");
    else if (path === "/staff/orders") setActiveItem("orders");
    else if (path === "/staff/categories") setActiveItem("categories");
    else if (path === "/staff/brands") setActiveItem("brands");
  }, [location]);

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

export function Products({ data }) {
  return (
    <div className="products-content">
      <h2>Products</h2>
      <ProductList />
    </div>
  );
}

export function Users() {
  return (
    <div className="users-content">
      <h2>Users</h2>
      <UsersList />
    </div>
  );
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