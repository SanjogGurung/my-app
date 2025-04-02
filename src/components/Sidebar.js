import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faList,
  faCircleUser,
  faMobile,
  faTruck,
  faAppleAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="side-bar">
      <Link
        to="/staff/overview"
        className={`overview ${isActive("/staff/overview") ? "active" : ""}`}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faHouse} />
        </span>
        <span>Overview</span>
      </Link>

      <Link
        to="/staff/users"
        className={`users ${isActive("/staff/users") ? "active" : ""}`}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faCircleUser} />
        </span>
        <span>Users</span>
      </Link>

      <Link
        to="/staff/products"
        className={`products ${isActive("/staff/products") ? "active" : ""}`}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faMobile} />
        </span>
        <span>Products</span>
      </Link>

      <Link
        to="/staff/orders"
        className={`orders ${isActive("/staff/orders") ? "active" : ""}`}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faTruck} />
        </span>
        <span>Orders</span>
      </Link>

      <Link
        to="/staff/categories"
        className={`categories ${isActive("/staff/categories") ? "active" : ""}`}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faList} />
        </span>
        <span>Categories</span>
      </Link>

      <Link
        to="/staff/brands"
        className={`brands ${isActive("/staff/brands") ? "active" : ""}`}
      >
        <span className="icon-wrapper">
          <FontAwesomeIcon icon={faAppleAlt} />
        </span>
        <span>Brands</span>
      </Link>
    </div>
  );
}