import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import "../styles/staff/Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faList,
  faCircleUser,
  faMobile,
  faTruck,
  faAppleAlt,
  faPlusCircle,
  faPhotoFilm
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ handleClick, sidebarState }) {
  const navigate = useNavigate();

  const {
    isOverviewActive,
    isUsersActive,
    isProductsActive,
    isAddProductActive,
    isAddWallpaperActive,
    isOrdersActive,
    isCategoriesActive,
    isBrandsActive,
  } = sidebarState;

  const handleNavigation = (item, path) => {
    handleClick(item);
    navigate(path);
  };


  return (
    <div className="side-bar">
      <button
        onClick={() => handleNavigation("overview", "/staff/overview")}
        className={`overview ${isOverviewActive ? "active" : ""}`}
        aria-pressed={isOverviewActive}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faHouse} />
        </span>
        <span>Overview</span>
      </button>

      <button
        onClick={() => handleNavigation("users", "/staff/users")}
        className={`users ${isUsersActive ? "active" : ""}`}
        aria-pressed={isUsersActive}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faCircleUser} />
        </span>
        <span>Users</span>
      </button>

      <button
        onClick={() => handleNavigation("products", "/staff/products")}
        className={`products ${isProductsActive ? "active" : ""}`}
        aria-pressed={isProductsActive}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faMobile} />
        </span>
        <span>Products</span>
      </button>

      <button
        onClick={() => handleNavigation("addProduct", "/staff/addProduct")}
        className={`addProduct ${isAddProductActive ? "active" : ""}`}
        aria-pressed={isAddProductActive}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faPlusCircle} />
        </span>
        <span>Add Product</span>
      </button>

      <button
        onClick={() => handleNavigation("addWallpaper", "/staff/addWallpaper")}
        className={`addWallpaper ${isAddWallpaperActive ? "active" : ""}`}
        aria-pressed={isAddWallpaperActive}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faPhotoFilm} />
        </span>
        <span>Add Wallpaper</span>
      </button>

      <button
        onClick={() => handleNavigation("orders", "/staff/orders")}
        className={`orders ${isOrdersActive ? "active" : ""}`}
        aria-pressed={isOrdersActive}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faTruck} />
        </span>
        <span>Orders</span>
      </button>

      <button
        onClick={() => handleNavigation("categories", "/staff/categories")}
        className={`categories ${isCategoriesActive ? "active" : ""}`}
        aria-pressed={isCategoriesActive}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faList} />
        </span>
        <span>Categories</span>
      </button>

      <button
        onClick={() => handleNavigation("brands", "/staff/brands")}
        className={`brands ${isBrandsActive ? "active" : ""}`}
        aria-pressed={isBrandsActive}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faAppleAlt} />
        </span>
        <span>Brands</span>
      </button>
    </div>
  );

  }