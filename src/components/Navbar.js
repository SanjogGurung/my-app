import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'
import { FaSearch } from 'react-icons/fa'; // Import search icon


export default function Navbar() {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`); // Navigate to search results page
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">SuSankhya</Link>
      </div>

      <div className="search-container">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>
      </div>

      

      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      <div className="navbar-auth">
        <Link to="/signup" className="signup-btn">Sign Up</Link>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </nav>
  )
}